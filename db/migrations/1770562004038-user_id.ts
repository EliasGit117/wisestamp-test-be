import { MigrationInterface, QueryRunner } from "typeorm";

export class UserId1770562004038 implements MigrationInterface {
    name = 'UserId1770562004038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "signatures" DROP CONSTRAINT "FK_d03d5b61e9fc2ee9a6cfa898cc5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d03d5b61e9fc2ee9a6cfa898cc"`);
        await queryRunner.query(`ALTER TABLE "signatures" DROP COLUMN "userId"`);
        await queryRunner.query(`CREATE INDEX "IDX_c93e294b75e34b850a599a51e2" ON "signatures" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "signatures" ADD CONSTRAINT "FK_c93e294b75e34b850a599a51e2c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "signatures" DROP CONSTRAINT "FK_c93e294b75e34b850a599a51e2c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c93e294b75e34b850a599a51e2"`);
        await queryRunner.query(`ALTER TABLE "signatures" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_d03d5b61e9fc2ee9a6cfa898cc" ON "signatures" ("userId") `);
        await queryRunner.query(`ALTER TABLE "signatures" ADD CONSTRAINT "FK_d03d5b61e9fc2ee9a6cfa898cc5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
