import { MigrationInterface, QueryRunner } from "typeorm";

export class Generation1770560177217 implements MigrationInterface {
    name = 'Generation1770560177217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "generated_signatures" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "signature_id" integer NOT NULL, "html" text NOT NULL, "text" text NOT NULL, CONSTRAINT "REL_ad884d0b24e4c8f05f4d5ad780" UNIQUE ("signature_id"), CONSTRAINT "PK_9c649ce8a1d017ab99e386cbfa7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ad884d0b24e4c8f05f4d5ad780" ON "generated_signatures" ("signature_id") `);
        await queryRunner.query(`ALTER TABLE "generated_signatures" ADD CONSTRAINT "FK_ad884d0b24e4c8f05f4d5ad780e" FOREIGN KEY ("signature_id") REFERENCES "signatures"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "generated_signatures" DROP CONSTRAINT "FK_ad884d0b24e4c8f05f4d5ad780e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad884d0b24e4c8f05f4d5ad780"`);
        await queryRunner.query(`DROP TABLE "generated_signatures"`);
    }

}
