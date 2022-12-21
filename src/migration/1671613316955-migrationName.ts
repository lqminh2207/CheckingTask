import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationName1671613316955 implements MigrationInterface {
    name = 'migrationName1671613316955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "member"
            ALTER COLUMN "password" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "member"
            ALTER COLUMN "dob" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "member"
            ALTER COLUMN "dob"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "member"
            ALTER COLUMN "password"
            SET NOT NULL
        `);
    }

}
