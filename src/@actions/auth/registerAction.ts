"use server";

import { Message } from "@/@types/message";
import { User } from "@/@types/user";
import db from "@/lib/db";
import { hashSync } from "bcrypt-ts";
import { randomUUID } from "crypto";
import { ConfirmRegisterEmail } from "../../@utils/email/ConfirmRegisterEmail";

async function sendEmail(user: User) {
  if (!user.confirmCode) return;
  const confirmEmail = new ConfirmRegisterEmail();
  await confirmEmail.execute(user.name, user.email, user.confirmCode);
}

export default async function registerAction(
  formData: FormData,
  isAdmin: boolean = false,
): Promise<Message> {
  const entries = Array.from(formData.entries());

  const data = Object.fromEntries(entries) as {
    name: string;
    email: string;
    password: string;
    admin?: string;
    google?: string;
  };

  const userAdmin = data.admin === "on";
  const isGoogle = data.google === "true";

  if (!data.name || !data.email || !data.password) {
    return { success: false, message: "Preencha todos os campos" };
  }

  if (data.password.length < 8) {
    return {
      success: false,
      message: "A senha deve ter pelo menos 8 caracteres",
    };
  }

  const findUser = await db.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (findUser) {
    return { success: false, message: "Esse email já está em uso!" };
  }

  const confirmCode = !isAdmin && !isGoogle ? randomUUID() : null;

  const user: User = await db.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashSync(data.password),
      confirmed: isAdmin || isGoogle,
      confirmCode,
      type: userAdmin ? "admin" : "user",
    },
  });

  if (confirmCode) {
    await sendEmail(user);
  }

  return {
    success: true,
    message: "Usuário cadastrado com sucesso!",
  };
}
