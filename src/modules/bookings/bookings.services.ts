import { pool } from "../../config/db";

const create = async ( customer_id: number, vehicle_id: number, rent_start_date: string, rent_end_date: string) =>{
    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
        throw new Error("fields are required");
    }
    if (new Date(rent_start_date) < new Date()) {
        throw new Error("Start date must be in the future");
    }
    if (new Date(rent_end_date) <= new Date(rent_start_date)) {
        throw new Error("End date must be after start date");
    }
    const userCheck = await pool.query(`SELECT * FROM users WHERE id=$1`, [customer_id]);
        if(userCheck.rows.length === 0){
            throw new Error("User not found");
        }
    
    const vehicleCheck = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id]);
        if(vehicleCheck.rows[0].availability_status == "available"){
        await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, ["booked", vehicle_id]);
        }
        else if(vehicleCheck.rows.length === 0){
            throw new Error("Vehicle not found");
        }
        else{
            throw new Error("Vehicle not available");
        }

  const result = await pool.query(
    `INSERT INTO bookings 
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
     VALUES 
      ($1, $2, $3, $4,
        (SELECT daily_rent_price * (($4::date - $3::date)::int)
         FROM vehicles WHERE id=$2)
      )
     RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date]
  );
    return {
        result,
        vehicleCheck
    };
}

const getAllBookings = async () => {
  const result = await pool.query(`
    SELECT 
      b.id AS booking_id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,

      u.name AS customer_name,
      u.email AS customer_email,

      v.vehicle_name,
      v.registration_number,
      v.type

    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
  `);

  return result;
};

const updateBookingStatus = async (id: number, status: string) => {
    const bookingCheck = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);
    if(bookingCheck.rows.length === 0){
        throw new Error("Booking not found");
    }

    const vehicle_id = bookingCheck.rows[0].vehicle_id;

    if(status === "cancelled"){
        const rent_start_date = new Date(bookingCheck.rows[0].rent_start_date);
        const currentDate = new Date();
        if(currentDate >= rent_start_date){
            throw new Error("Cannot cancel booking after start date");
        }
        await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, ["available", vehicle_id]);
    }

    if(status === "returned"){
        await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, ["available", vehicle_id]);
    }

    const rentEnd = new Date(bookingCheck.rows[0].rent_end_date);
    const now = new Date();
    if(now > rentEnd && status !== "returned"){
        status = "returned";
        await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, ["available", vehicle_id]);
    }


    const result = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`, [status, id]);
    return result;
}
export const bookingServices = {
    create,
    getAllBookings,
    updateBookingStatus,
};