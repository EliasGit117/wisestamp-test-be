import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1770476245991 implements MigrationInterface {
    name = 'Init1770476245991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."refresh_tokens_status_enum" AS ENUM('active', 'revoked')`);
        await queryRunner.query(`CREATE TYPE "public"."refresh_tokens_browser_type_enum" AS ENUM('chrome', 'firefox', 'safari', 'edge', 'opera', 'chrome_mobile', 'safari_mobile', 'firefox_mobile', 'samsung_internet', 'facebook', 'instagram', 'ie', 'unknown')`);
        await queryRunner.query(`CREATE TYPE "public"."refresh_tokens_device_type_enum" AS ENUM('desktop', 'mobile', 'tablet', 'bot', 'unknown')`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ip_address" character varying(45) NOT NULL, "status" "public"."refresh_tokens_status_enum" NOT NULL DEFAULT 'active', "user_agent" character varying(512), "user_id" integer NOT NULL, "browser_type" "public"."refresh_tokens_browser_type_enum" NOT NULL DEFAULT 'unknown', "device_type" "public"."refresh_tokens_device_type_enum" NOT NULL DEFAULT 'unknown', "expires" TIMESTAMP WITH TIME ZONE NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(256) NOT NULL, "first_name" character varying(256) NOT NULL, "last_name" character varying(256) NOT NULL, "password" character varying(256) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "status" "public"."users_status_enum" NOT NULL DEFAULT 'inactive', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."signatures_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "signatures" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "template_id" character varying(100) NOT NULL, "payload" jsonb NOT NULL, "html" text, "text" text, "webhook_url" character varying(500), "status" "public"."signatures_status_enum" NOT NULL DEFAULT 'pending', "error_message" text, "attempts" integer NOT NULL DEFAULT '0', "userId" integer NOT NULL, CONSTRAINT "PK_f56eb3cd344ce7f9ae28ce814eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d03d5b61e9fc2ee9a6cfa898cc" ON "signatures" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e11d18ba078ea72f000083bdc3" ON "signatures" ("status") `);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "signatures" ADD CONSTRAINT "FK_d03d5b61e9fc2ee9a6cfa898cc5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "signatures" DROP CONSTRAINT "FK_d03d5b61e9fc2ee9a6cfa898cc5"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e11d18ba078ea72f000083bdc3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d03d5b61e9fc2ee9a6cfa898cc"`);
        await queryRunner.query(`DROP TABLE "signatures"`);
        await queryRunner.query(`DROP TYPE "public"."signatures_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TYPE "public"."refresh_tokens_device_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."refresh_tokens_browser_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."refresh_tokens_status_enum"`);
    }

}
