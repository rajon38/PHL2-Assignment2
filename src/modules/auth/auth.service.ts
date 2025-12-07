import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signupUser = async (name: string, email: string, password: string, phone: string, role: string) => {
    if (!name || !email || !password) {
        throw new Error("fields are required");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, email, hashedPassword, phone, role]
    );
    return result;
}

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return false;
  }

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );

  return { token, user };
};

export const authServices = {
  signupUser,
  loginUser,
};