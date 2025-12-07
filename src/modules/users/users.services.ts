import { pool } from "../../config/db";

const getAllUsers = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    return result;
}

const updatedUser = async (id: number, name: string,  phone: string, role?: string) => {
    const result =
        role !== undefined
            ? await pool.query(
                  `UPDATE users SET name=$1, phone=$2, role=$3 WHERE id=$4 RETURNING *`,
                  [name, phone, role, id]
              )
            : await pool.query(
                  `UPDATE users SET name=$1, phone=$2 WHERE id=$3 RETURNING *`,
                  [name, phone, id]
              );
    if (result.rows.length === 0) {
        throw new Error("User not found");
    }
    return result.rows[0];
};

const deleteUser = async (id: number) => {
    const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [id]);
    if (result.rows.length === 0) {
        throw new Error("User not found");
    }
    return result.rows[0];
};

export const userServices = {
  getAllUsers,
  updatedUser,
  deleteUser,
};