import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";
import { hash } from "bcrypt-ts-edge"; // Assuming you're hashing passwords

const main = async () => {
  const prisma = new PrismaClient();

  // Hash passwords if needed
  for (const user of sampleData.users) {
    user.password = await hash(user.password, 10); // Ensure passwords are hashed
  }

  try {
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    await prisma.product.createMany({ data: sampleData.products });
    await prisma.user.createMany({ data: sampleData.users });

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
