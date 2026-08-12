-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('blog', 'noticia', 'taller');
CREATE TYPE "PostStatus" AS ENUM ('draft', 'published');
CREATE TYPE "FeedbackType" AS ENUM ('opinion', 'experience', 'testimonial');
CREATE TYPE "FeedbackStatus" AS ENUM ('published', 'hidden');

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "homeVisible" BOOLEAN NOT NULL DEFAULT true,
    "homeImage" TEXT NOT NULL DEFAULT '',
    "homeStory" TEXT NOT NULL DEFAULT '',
    "homeCta" TEXT NOT NULL DEFAULT 'Ver colección',
    "homeOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eyebrow" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "materials" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "elaborationTime" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "photos" TEXT[],
    "sectionId" TEXT NOT NULL,
    "inStock" BOOLEAN NOT NULL,
    "stockQty" INTEGER NOT NULL,
    "variants" JSONB NOT NULL,
    "model3dUrl" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "PostCategory" NOT NULL,
    "excerpt" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "gallery_images" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "portrait" BOOLEAN NOT NULL,
    "alt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "feedback" (
    "id" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "photo" TEXT NOT NULL DEFAULT '',
    "text" TEXT NOT NULL,
    "status" "FeedbackStatus" NOT NULL,
    "origin" TEXT NOT NULL,
    "featuredOnHome" BOOLEAN NOT NULL DEFAULT true,
    "homeOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "promotions" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "productId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "ctaLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "productId" TEXT,
    "product" TEXT,
    "referrer" TEXT NOT NULL,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "admin_credentials" (
    "id" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "admin_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_sectionId_idx" ON "products"("sectionId");
CREATE INDEX "promotions_productId_idx" ON "promotions"("productId");
CREATE INDEX "analytics_events_kind_createdAt_idx" ON "analytics_events"("kind", "createdAt");
CREATE INDEX "analytics_events_sessionId_idx" ON "analytics_events"("sessionId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
