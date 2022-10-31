/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `TestQuestion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `TestQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestQuestion" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserCourse" ADD COLUMN     "lastTestOn" TIMESTAMP(3),
ADD COLUMN     "lastTestPassed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "TestIstance" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "isExpired" BOOLEAN NOT NULL,
    "isSubmitted" BOOLEAN NOT NULL,
    "isPassed" BOOLEAN NOT NULL,
    "submittedOn" TIMESTAMP(3),
    "cratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestIstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestIstanceQuestion" (
    "id" SERIAL NOT NULL,
    "instanceId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "givenAnswerId" INTEGER,

    CONSTRAINT "TestIstanceQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestQuestion_code_key" ON "TestQuestion"("code");

-- AddForeignKey
ALTER TABLE "TestIstance" ADD CONSTRAINT "TestIstance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestIstance" ADD CONSTRAINT "TestIstance_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestIstanceQuestion" ADD CONSTRAINT "TestIstanceQuestion_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "TestIstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestIstanceQuestion" ADD CONSTRAINT "TestIstanceQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "TestQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestIstanceQuestion" ADD CONSTRAINT "TestIstanceQuestion_givenAnswerId_fkey" FOREIGN KEY ("givenAnswerId") REFERENCES "TestAnswer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
