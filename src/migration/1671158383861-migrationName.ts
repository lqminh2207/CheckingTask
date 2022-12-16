import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationName1671158383861 implements MigrationInterface {
    name = 'migrationName1671158383861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD "memberId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "task_status"
            ADD CONSTRAINT "UQ_007307d7c7ddab3fe3a65e30351" UNIQUE ("order")
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD CONSTRAINT "FK_4717cc76f5396752a877e881aef" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "task" DROP CONSTRAINT "FK_4717cc76f5396752a877e881aef"
        `);
        await queryRunner.query(`
            ALTER TABLE "task_status" DROP CONSTRAINT "UQ_007307d7c7ddab3fe3a65e30351"
        `);
        await queryRunner.query(`
            ALTER TABLE "task" DROP COLUMN "memberId"
        `);
    }

}
