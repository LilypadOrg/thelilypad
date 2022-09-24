-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "levelNumber" INTEGER NOT NULL,
    "cratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLevel" (
    "number" INTEGER NOT NULL,
    "xpFrom" INTEGER NOT NULL,
    "xpTo" INTEGER NOT NULL,

    CONSTRAINT "UserLevel_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "contentTypeId" INTEGER NOT NULL,
    "cratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "contentId" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" INTEGER NOT NULL,
    "contentId" INTEGER NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCourse" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "roadmap" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedOn" TIMESTAMP(3),

    CONSTRAINT "UserCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "location" TEXT NOT NULL,
    "contentId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityProject" (
    "id" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "codeUrl" TEXT,
    "contentId" INTEGER NOT NULL,

    CONSTRAINT "CommunityProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "ContentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseLevel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "CourseLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContentToTechnology" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ContentToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TechnologyToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToCourseLevel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Content_title_key" ON "Content"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Content_slug_key" ON "Content"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Technology_name_key" ON "Technology"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Technology_slug_key" ON "Technology"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Course_contentId_key" ON "Course"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_contentId_key" ON "Resource"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCourse_userId_courseId_key" ON "UserCourse"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_contentId_key" ON "Event"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityProject_contentId_key" ON "CommunityProject"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentType_name_key" ON "ContentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ContentType_slug_key" ON "ContentType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CourseLevel_name_key" ON "CourseLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CourseLevel_slug_key" ON "CourseLevel"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_ContentToTechnology_AB_unique" ON "_ContentToTechnology"("A", "B");

-- CreateIndex
CREATE INDEX "_ContentToTechnology_B_index" ON "_ContentToTechnology"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContentToTag_AB_unique" ON "_ContentToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ContentToTag_B_index" ON "_ContentToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TechnologyToUser_AB_unique" ON "_TechnologyToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TechnologyToUser_B_index" ON "_TechnologyToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToCourseLevel_AB_unique" ON "_CourseToCourseLevel"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToCourseLevel_B_index" ON "_CourseToCourseLevel"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_levelNumber_fkey" FOREIGN KEY ("levelNumber") REFERENCES "UserLevel"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "ContentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityProject" ADD CONSTRAINT "CommunityProject_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToTechnology" ADD CONSTRAINT "_ContentToTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToTechnology" ADD CONSTRAINT "_ContentToTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToTag" ADD CONSTRAINT "_ContentToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToTag" ADD CONSTRAINT "_ContentToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TechnologyToUser" ADD CONSTRAINT "_TechnologyToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TechnologyToUser" ADD CONSTRAINT "_TechnologyToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseLevel" ADD CONSTRAINT "_CourseToCourseLevel_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToCourseLevel" ADD CONSTRAINT "_CourseToCourseLevel_B_fkey" FOREIGN KEY ("B") REFERENCES "CourseLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
