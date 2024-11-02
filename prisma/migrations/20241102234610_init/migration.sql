-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userImage" TEXT DEFAULT '/assets/user-default-profile-image.webp',
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isDev" BOOLEAN DEFAULT false,
    "isAdmin" BOOLEAN DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "productImage" TEXT DEFAULT '/assets/product-default-profile-image.jpg',
    "title" TEXT NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnProducts" (
    "authorProdId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "UsersOnProducts_pkey" PRIMARY KEY ("authorProdId","authorId")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aboutme" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "image" TEXT DEFAULT '/assets/aboutme-default-profile-image.jpg',
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Aboutme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_title_key" ON "Product"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Aboutme_title_key" ON "Aboutme"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Aboutme_authorId_key" ON "Aboutme"("authorId");

-- AddForeignKey
ALTER TABLE "UsersOnProducts" ADD CONSTRAINT "UsersOnProducts_authorProdId_fkey" FOREIGN KEY ("authorProdId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnProducts" ADD CONSTRAINT "UsersOnProducts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aboutme" ADD CONSTRAINT "Aboutme_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
