import { pool } from "../../config/db";

const vehicles = async (vehicle_name: string, type: string, registration_number: string, daily_rent_price: number, availability_status: string ) => {
    if (!vehicle_name || !type || !registration_number || !daily_rent_price) {
        throw new Error("fields are required");
    }
    const result = await pool.query(
        `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );
    return result;
}

const getAllVehicles = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result;
}

const getOneVehicle = async (id: number) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
    if (result.rows.length === 0) {
        throw new Error("Vehicle not found");
    }
    return result;
}

const updateVehicle = async (id: number, vehicle_name: string, type: string, registration_number: string, daily_rent_price: number, availability_status: string) => {
    const result = await pool.query(
        `UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
    );
    if (result.rows.length === 0) {
        throw new Error("Vehicle not found");
    }
    return result;
}

const deleteVehicle = async (id: number) => {
    const result = await pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING *`, [id]);
    if (result.rows.length === 0) {
        throw new Error("Vehicle not found");
    }
    return result;
}

export const vehicleServices = {
  vehicles,
  getAllVehicles,
  getOneVehicle,
  updateVehicle,
  deleteVehicle,
};