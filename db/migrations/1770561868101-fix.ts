import { MigrationInterface, QueryRunner } from "typeorm";

export class Fix1770561868101 implements MigrationInterface {
    name = 'Fix1770561868101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "signatures" DROP COLUMN "html"`);
        await queryRunner.query(`ALTER TABLE "signatures" DROP COLUMN "text"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "signatures" ADD "text" text`);
        await queryRunner.query(`ALTER TABLE "signatures" ADD "html" text`);
    }

}
