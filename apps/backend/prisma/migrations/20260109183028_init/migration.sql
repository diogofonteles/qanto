-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('consumer', 'supermarket', 'admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'suspended', 'pending');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('active', 'inactive', 'out_of_stock');

-- CreateEnum
CREATE TYPE "ListStatus" AS ENUM ('active', 'completed', 'archived');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('consumer', 'supermarket');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('view_product', 'click_product', 'add_to_list', 'remove_from_list', 'create_comparison', 'view_comparison', 'create_alert', 'search_product');

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PlanType" NOT NULL,
    "compareLimit" INTEGER,
    "alertLimit" INTEGER,
    "featuredLimit" INTEGER,
    "features" JSONB NOT NULL DEFAULT '{}',
    "priceCents" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'consumer',
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "phone" TEXT,
    "birthDate" TIMESTAMP(3),
    "addressStreet" TEXT,
    "addressNumber" TEXT,
    "addressComplement" TEXT,
    "addressNeighborhood" TEXT,
    "addressCity" TEXT,
    "addressState" TEXT,
    "addressZipcode" TEXT,
    "addressLat" DECIMAL(10,8),
    "addressLng" DECIMAL(11,8),
    "searchRadiusKm" INTEGER NOT NULL DEFAULT 5,
    "planId" TEXT,
    "googleId" TEXT,
    "appleId" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supermarkets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "tradingName" TEXT,
    "cnpj" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "addressStreet" TEXT NOT NULL,
    "addressNumber" TEXT NOT NULL,
    "addressComplement" TEXT,
    "addressNeighborhood" TEXT NOT NULL,
    "addressCity" TEXT NOT NULL,
    "addressState" TEXT NOT NULL,
    "addressZipcode" TEXT NOT NULL,
    "addressLat" DECIMAL(10,8) NOT NULL,
    "addressLng" DECIMAL(11,8) NOT NULL,
    "logoUrl" TEXT,
    "description" TEXT,
    "openingHours" JSONB,
    "apiEndpoint" TEXT,
    "apiKey" TEXT,
    "lastSyncAt" TIMESTAMP(3),
    "rankingScore" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "planId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supermarkets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentId" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "supermarketId" TEXT NOT NULL,
    "categoryId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "barcode" TEXT,
    "sku" TEXT,
    "brand" TEXT,
    "unit" TEXT NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "promoPriceCents" INTEGER,
    "promoStartDate" TIMESTAMP(3),
    "promoEndDate" TIMESTAMP(3),
    "imageUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "featuredUntil" TIMESTAMP(3),
    "status" "ProductStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_history" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "promoPriceCents" INTEGER,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_lists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ListStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shopping_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_items" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "list_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparisons" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listId" TEXT,
    "supermarketIds" TEXT[],
    "results" JSONB NOT NULL,
    "cheapestSupermarketId" TEXT,
    "cheapestTotalCents" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_alerts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "targetPriceCents" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "triggeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "eventType" "EventType" NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_stats" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "listAdds" INTEGER NOT NULL DEFAULT 0,
    "comparisonIncludes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supermarket_stats" (
    "id" TEXT NOT NULL,
    "supermarketId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "comparisonsIncluded" INTEGER NOT NULL DEFAULT 0,
    "cheapestWins" INTEGER NOT NULL DEFAULT 0,
    "productsViewed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "supermarket_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "csv_imports" (
    "id" TEXT NOT NULL,
    "supermarketId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT,
    "totalRows" INTEGER,
    "successRows" INTEGER,
    "errorRows" INTEGER,
    "errors" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "csv_imports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plans_name_key" ON "plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "users_appleId_key" ON "users"("appleId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_addressLat_addressLng_idx" ON "users"("addressLat", "addressLng");

-- CreateIndex
CREATE UNIQUE INDEX "supermarkets_userId_key" ON "supermarkets"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "supermarkets_cnpj_key" ON "supermarkets"("cnpj");

-- CreateIndex
CREATE INDEX "supermarkets_addressLat_addressLng_idx" ON "supermarkets"("addressLat", "addressLng");

-- CreateIndex
CREATE INDEX "supermarkets_addressCity_idx" ON "supermarkets"("addressCity");

-- CreateIndex
CREATE INDEX "supermarkets_cnpj_idx" ON "supermarkets"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "products_supermarketId_idx" ON "products"("supermarketId");

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

-- CreateIndex
CREATE INDEX "products_barcode_idx" ON "products"("barcode");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- CreateIndex
CREATE INDEX "products_isFeatured_featuredUntil_idx" ON "products"("isFeatured", "featuredUntil");

-- CreateIndex
CREATE INDEX "products_promoStartDate_promoEndDate_idx" ON "products"("promoStartDate", "promoEndDate");

-- CreateIndex
CREATE INDEX "price_history_productId_recordedAt_idx" ON "price_history"("productId", "recordedAt" DESC);

-- CreateIndex
CREATE INDEX "shopping_lists_userId_status_idx" ON "shopping_lists"("userId", "status");

-- CreateIndex
CREATE INDEX "list_items_listId_idx" ON "list_items"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "list_items_listId_productId_key" ON "list_items"("listId", "productId");

-- CreateIndex
CREATE INDEX "comparisons_userId_createdAt_idx" ON "comparisons"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "price_alerts_userId_isActive_idx" ON "price_alerts"("userId", "isActive");

-- CreateIndex
CREATE INDEX "price_alerts_productId_isActive_idx" ON "price_alerts"("productId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "price_alerts_userId_productId_key" ON "price_alerts"("userId", "productId");

-- CreateIndex
CREATE INDEX "user_events_userId_createdAt_idx" ON "user_events"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "user_events_eventType_createdAt_idx" ON "user_events"("eventType", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "user_events_entityType_entityId_idx" ON "user_events"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "product_stats_productId_date_idx" ON "product_stats"("productId", "date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "product_stats_productId_date_key" ON "product_stats"("productId", "date");

-- CreateIndex
CREATE INDEX "supermarket_stats_supermarketId_date_idx" ON "supermarket_stats"("supermarketId", "date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "supermarket_stats_supermarketId_date_key" ON "supermarket_stats"("supermarketId", "date");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supermarkets" ADD CONSTRAINT "supermarkets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supermarkets" ADD CONSTRAINT "supermarkets_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supermarketId_fkey" FOREIGN KEY ("supermarketId") REFERENCES "supermarkets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_lists" ADD CONSTRAINT "shopping_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_listId_fkey" FOREIGN KEY ("listId") REFERENCES "shopping_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_listId_fkey" FOREIGN KEY ("listId") REFERENCES "shopping_lists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_cheapestSupermarketId_fkey" FOREIGN KEY ("cheapestSupermarketId") REFERENCES "supermarkets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_events" ADD CONSTRAINT "user_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_stats" ADD CONSTRAINT "product_stats_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supermarket_stats" ADD CONSTRAINT "supermarket_stats_supermarketId_fkey" FOREIGN KEY ("supermarketId") REFERENCES "supermarkets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "csv_imports" ADD CONSTRAINT "csv_imports_supermarketId_fkey" FOREIGN KEY ("supermarketId") REFERENCES "supermarkets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
