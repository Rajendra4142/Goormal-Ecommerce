"use server";
import { convertToPlainObject, formatError } from "../utils";
import { lATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validators";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export async function getLatestProduct() {
  // const prisma = new PrismaClient();
  const data = await prisma.product.findMany({
    take: lATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });
  return convertToPlainObject(data);
}

// get single product by its slug
export async function getProductByslug(slug: string) {
  return await prisma.product.findFirst({
    where: {
      slug: slug,
    },
  });
}
// get single product by its id
export async function getProductById(productid: string) {
  const data = await prisma.product.findFirst({
    where: {
      id: productid,
    },
  });
  return convertToPlainObject(data);
}

// Get all products with filtering
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  // Create a filter object based on query and category
  const whereFilter: Prisma.ProductWhereInput = {};

  // If query exists, filter products with case-insensitive search
  if (query) {
    whereFilter.name = {
      contains: query,
      mode: "insensitive", // Case-insensitive search
    };
  }

  // If category exists, filter by category
  if (category) {
    whereFilter.category = category;
  }

  // Fetch products based on filters
  const data = await prisma.product.findMany({
    where: whereFilter,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  // Get the total count of products with filters
  const dataCount = await prisma.product.count({
    where: whereFilter,
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//delete a product
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error("Product not found");
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product deleted succesfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//create product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });

    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//update product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);

    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error("Product doesnot exists");
    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  return convertToPlainObject(data);
}
