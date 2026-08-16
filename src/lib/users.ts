import bcrypt from "bcryptjs";
import { db, newId } from "./db";

export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

export function findUserByEmail(email: string): User | undefined {
  return db()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.trim().toLowerCase()) as User | undefined;
}

export function findUserById(id: string): User | undefined {
  return db().prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
}

export async function createUser(name: string, email: string, password: string): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = findUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error("Já existe uma conta com esse e-mail.");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const id = newId();
  db()
    .prepare(
      "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
    )
    .run(id, name.trim(), normalizedEmail, passwordHash);
  return findUserById(id)!;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password_hash);
}
