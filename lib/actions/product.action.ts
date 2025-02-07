"use server";

import { PrismaClient } from "@prisma/client";
import { convertToPlainObject } from "../utils";
import { lATEST_PRODUCTS_LIMIT } from "../constants";

export async function getLatestProduct() {
  const prisma = new PrismaClient();
  const data = await prisma.product.findMany({
    take: lATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });
  return convertToPlainObject(data);
}
