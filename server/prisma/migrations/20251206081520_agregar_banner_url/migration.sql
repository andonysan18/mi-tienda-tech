-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "discount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;
