import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PinoLogger } from "nestjs-pino";

import { SignatureEntity } from "@src/modules/signatures/entities/signature.entity";
import { GeneratedSignatureEntity } from "@src/modules/signatures/entities/generated-signature.entity";
import { SignatureGeneratorService } from "@src/modules/signatures/services/signature-generator.service";
import {
  GeneratedSignatureResultDtoCacheService
} from '@src/modules/signatures/services/generated-signature-result-dto-cache.service';


@Injectable()
export class SignatureGenerationJobService {

  constructor(
    @InjectRepository(GeneratedSignatureEntity)
    private readonly generatedSignatureRepository: Repository<GeneratedSignatureEntity>,
    @InjectRepository(SignatureEntity)
    private readonly signatureRepository: Repository<SignatureEntity>,
    private readonly cacheService: GeneratedSignatureResultDtoCacheService,
    private readonly signatureGenerator: SignatureGeneratorService,
    private readonly dataSource: DataSource,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(SignatureGenerationJobService.name);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron(): Promise<void> {
    this.logger.info("Signature generation cron started");

    try {
      await this.run();
      this.logger.info("Signature generation cron finished");
    } catch (error) {
      this.logger.error({ err: error }, "Signature generation cron failed");
    }
  }

  async run(): Promise<void> {
    const signatures = await this.pickSignaturesForGeneration(50);
    this.logger.info({ count: signatures.length }, "Picked signatures for generation");

    for (const signature of signatures) {
      try {
        this.logger.debug({ signatureId: signature.id }, "Generating signature",);
        const html = this.signatureGenerator.generateHtml(signature.templateId, signature.payload,);
        const text = this.signatureGenerator.generateText(signature.payload,);

        await this.generatedSignatureRepository.save({
          signatureId: signature.id,
          signature,
          html,
          text
        });

        const entity = await this.signatureRepository.findOne({ where: { id: signature.id } });
        if (entity == null) {
          this.logger.debug('Signature generated but not saved to cache')
          return;
        }

        this.cacheService.createDtoAndSave(entity);

        this.logger.debug({ signatureId: signature.id }, "Signature generated successfully",);
      } catch (error) {
        this.logger.error({ err: error, signatureId: signature.id }, "Failed to generate signature",);
      }
    }
  }

  private async pickSignaturesForGeneration(limit = 50): Promise<SignatureEntity[]> {
    this.logger.debug({ limit }, "Picking signatures for generation",);

    return this.dataSource.transaction(async (manager) => {
      const qb = manager
        .getRepository(SignatureEntity)
        .createQueryBuilder("s")
        .where(
          `
        NOT EXISTS (
          SELECT 1
          FROM generated_signatures gs
          WHERE gs.signature_id = s.id
        )
        OR EXISTS (
          SELECT 1
          FROM generated_signatures gs
          WHERE gs.signature_id = s.id
            AND gs.updated_at < s.updated_at
        )
        `,
        )
        .orderBy("s.updated_at", "ASC")
        .limit(limit)
        .setLock("pessimistic_write")
        .setOnLocked("skip_locked");

      const signatures = await qb.getMany();

      this.logger.debug({ count: signatures.length }, "Signatures locked and reserved for generation",);

      return signatures;
    });
  }
}