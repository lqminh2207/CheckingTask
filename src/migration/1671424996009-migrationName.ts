import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationName1671424996009 implements MigrationInterface {
    name = 'migrationName1671424996009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "task_priority"
            ADD CONSTRAINT "UQ_13a132796f428f72dd68f77f590" UNIQUE ("order")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "task_priority" DROP CONSTRAINT "UQ_13a132796f428f72dd68f77f590"
        `);
    }

}
