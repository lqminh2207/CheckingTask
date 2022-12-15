import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationName1671071365150 implements MigrationInterface {
    name = 'migrationName1671071365150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "type" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "color" character varying NOT NULL,
                "status" character varying NOT NULL DEFAULT 'ACTIVE',
                "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                CONSTRAINT "UQ_e23bfe7255ada131861292923fe" UNIQUE ("name"),
                CONSTRAINT "PK_40410d6bf0bedb43f9cadae6fef" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "task_priority" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "order" integer NOT NULL,
                "status" character varying NOT NULL DEFAULT 'ACTIVE',
                "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                CONSTRAINT "UQ_7d656b4cba8f11e639dbc5aab36" UNIQUE ("name"),
                CONSTRAINT "PK_42fc82c4e184b727a3ccd7863ee" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "member" (
                "id" SERIAL NOT NULL,
                "inviteId" character varying,
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                "dob" TIMESTAMP NOT NULL,
                "email" character varying NOT NULL,
                "image" character varying,
                "role" character varying NOT NULL DEFAULT 'MEMBER',
                "status" character varying NOT NULL DEFAULT 'ACTIVE',
                "rememberToken" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                CONSTRAINT "UQ_1945f9202fcfbce1b439b47b77a" UNIQUE ("username"),
                CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "project" (
                "id" SERIAL NOT NULL,
                "slug" character varying NOT NULL,
                "startDate" TIMESTAMP NOT NULL,
                "endDate" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                CONSTRAINT "UQ_6fce32ddd71197807027be6ad38" UNIQUE ("slug"),
                CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "task" (
                "id" SERIAL NOT NULL,
                "assignee" character varying NOT NULL,
                "startDate" TIMESTAMP NOT NULL,
                "endDate" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "projectId" integer,
                "taskPriorityId" integer,
                "taskStatusId" integer,
                "typeId" integer,
                CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "task_status" (
                "id" SERIAL NOT NULL,
                "statusName" character varying NOT NULL,
                "order" integer NOT NULL,
                "status" character varying NOT NULL DEFAULT 'ACTIVE',
                "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                CONSTRAINT "UQ_5e2bb45e18771077d90d36e4bd8" UNIQUE ("statusName"),
                CONSTRAINT "PK_b8747cc6a41b6cef4639babf61d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "project_members_member" (
                "projectId" integer NOT NULL,
                "memberId" integer NOT NULL,
                CONSTRAINT "PK_305f22250d35d7be8671e1df8fe" PRIMARY KEY ("projectId", "memberId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_f126532e0e39488c4ab79b1630" ON "project_members_member" ("projectId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_988dca8060aef04d09c9153531" ON "project_members_member" ("memberId")
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD CONSTRAINT "FK_b8616deefe44d0622233e73fbf9" FOREIGN KEY ("taskPriorityId") REFERENCES "task_priority"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD CONSTRAINT "FK_0cbe714983eb0aae5feeee8212b" FOREIGN KEY ("taskStatusId") REFERENCES "task_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD CONSTRAINT "FK_37835cf91476a114202962303c1" FOREIGN KEY ("typeId") REFERENCES "type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "project_members_member"
            ADD CONSTRAINT "FK_f126532e0e39488c4ab79b16302" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "project_members_member"
            ADD CONSTRAINT "FK_988dca8060aef04d09c9153531e" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "project_members_member" DROP CONSTRAINT "FK_988dca8060aef04d09c9153531e"
        `);
        await queryRunner.query(`
            ALTER TABLE "project_members_member" DROP CONSTRAINT "FK_f126532e0e39488c4ab79b16302"
        `);
        await queryRunner.query(`
            ALTER TABLE "task" DROP CONSTRAINT "FK_37835cf91476a114202962303c1"
        `);
        await queryRunner.query(`
            ALTER TABLE "task" DROP CONSTRAINT "FK_0cbe714983eb0aae5feeee8212b"
        `);
        await queryRunner.query(`
            ALTER TABLE "task" DROP CONSTRAINT "FK_b8616deefe44d0622233e73fbf9"
        `);
        await queryRunner.query(`
            ALTER TABLE "task" DROP CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_988dca8060aef04d09c9153531"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_f126532e0e39488c4ab79b1630"
        `);
        await queryRunner.query(`
            DROP TABLE "project_members_member"
        `);
        await queryRunner.query(`
            DROP TABLE "task_status"
        `);
        await queryRunner.query(`
            DROP TABLE "task"
        `);
        await queryRunner.query(`
            DROP TABLE "project"
        `);
        await queryRunner.query(`
            DROP TABLE "member"
        `);
        await queryRunner.query(`
            DROP TABLE "task_priority"
        `);
        await queryRunner.query(`
            DROP TABLE "type"
        `);
    }

}
