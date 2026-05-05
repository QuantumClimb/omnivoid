-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('MIXCLOUD', 'YOUTUBE', 'WEBSITE', 'SOCIAL', 'PODCAST', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('RESEARCH', 'CONUNDRUM', 'CONTACT', 'LABS', 'TRANSMISSIONS', 'CUSTOM');

-- CreateTable
CREATE TABLE "Gig" (
    "id" TEXT NOT NULL,
    "editionId" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "venue" TEXT,
    "location" TEXT,
    "address" TEXT,
    "hasWorkshop" BOOLEAN NOT NULL DEFAULT false,
    "workshopTitle" TEXT,
    "workshopDescription" TEXT,
    "workshopMaterials" TEXT,
    "workshopTime" TIMESTAMP(3),
    "images" TEXT[],
    "videoUrl" TEXT,
    "mixcloudUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPast" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "editionId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "LinkType" NOT NULL,
    "url" TEXT NOT NULL,
    "metadata" JSONB,
    "category" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "editionId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "type" "DocumentType" NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Gig_editionId_idx" ON "Gig"("editionId");

-- CreateIndex
CREATE INDEX "Gig_date_idx" ON "Gig"("date");

-- CreateIndex
CREATE INDEX "Gig_isActive_idx" ON "Gig"("isActive");

-- CreateIndex
CREATE INDEX "Gig_isFeatured_idx" ON "Gig"("isFeatured");

-- CreateIndex
CREATE INDEX "Link_editionId_idx" ON "Link"("editionId");

-- CreateIndex
CREATE INDEX "Link_type_idx" ON "Link"("type");

-- CreateIndex
CREATE INDEX "Link_category_idx" ON "Link"("category");

-- CreateIndex
CREATE INDEX "Link_isActive_idx" ON "Link"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Document_slug_key" ON "Document"("slug");

-- CreateIndex
CREATE INDEX "Document_editionId_idx" ON "Document"("editionId");

-- CreateIndex
CREATE INDEX "Document_type_idx" ON "Document"("type");

-- CreateIndex
CREATE INDEX "Document_isActive_idx" ON "Document"("isActive");

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
