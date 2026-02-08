import { MigrationInterface, QueryRunner } from "typeorm";

export class Cleanup1770559642430 implements MigrationInterface {
    name = 'Cleanup1770559642430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e11d18ba078ea72f000083bdc3"`);
        await queryRunner.query(`ALTER TABLE "signatures" DROP COLUMN "webhook_url"`);
        await queryRunner.query(`ALTER TABLE "signatures" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."signatures_status_enum"`);
        await queryRunner.query(`ALTER TABLE "signatures" DROP COLUMN "error_message"`);
        await queryRunner.query(`ALTER TABLE "signatures" DROP COLUMN "attempts"`);
        await queryRunner.query(`ALTER TABLE "signatures" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "signatures" DROP COLUMN "template_id"`);
        await queryRunner.query(`CREATE TYPE "public"."signatures_template_id_enum" AS ENUM('simple-green', 'light-squared')`);
        await queryRunner.query(`ALTER TABLE "signatures" ADD "template_id" "public"."signatures_template_id_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "signatures" DROP COLUMN "template_id"`);
        await queryRunner.query(`DROP TYPE "public"."signatures_template_id_enum"`);
        await queryRunner.query(`ALTER TABLE "signatures" ADD "template_id" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "signatures" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "signatures" ADD "attempts" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "signatures" ADD "error_message" text`);
        await queryRunner.query(`CREATE TYPE "public"."signatures_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed')`);
        await queryRunner.query(`ALTER TABLE "signatures" ADD "status" "public"."signatures_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "signatures" ADD "webhook_url" character varying(500)`);
        await queryRunner.query(`CREATE INDEX "IDX_e11d18ba078ea72f000083bdc3" ON "signatures" ("status") `);
    }

}
