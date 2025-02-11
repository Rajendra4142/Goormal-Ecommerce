"use server";
import { PrismaClient } from "@prisma/client";
import { convertToPlainObject } from "../utils";
import { lATEST_PRODUCTS_LIMIT } from "../constants";
import { prisma } from "@/db/prisma";
import exp from "constants";

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
