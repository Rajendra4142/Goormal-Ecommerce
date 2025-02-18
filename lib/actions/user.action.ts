"use server";
import { signIn, signOut } from "@/auth";
import { signInFormSchema, signUpFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";

// sign in the user with credentials

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    console.log(user);
    await signIn("credentials", user);
    return { success: true, message: "signed in successfully." };
  } catch (error) {
    console.log(error.name);
    console.log(error.password);
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password " };
  }
}

export async function signOutUser() {
  await signOut();
}

// sign up
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });
    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });
    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.log(error.name, error.code, error.errors, error.meta?.target);
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "User registerd failed " };
  }
}
