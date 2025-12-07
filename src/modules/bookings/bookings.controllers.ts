import { Request, Response } from "express";
import { bookingServices } from "./bookings.services";
const createBooking = async (req: Request, res: Response) => {
    try {
        const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
        const result = await bookingServices.create(customer_id, vehicle_id, rent_start_date, rent_end_date);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: {
                id: result.result.rows[0].id,
                customer_id: result.result.rows[0].customer_id,
                vehicle_id: result.result.rows[0].vehicle_id,
                rent_start_date: result.result.rows[0].rent_start_date,
                rent_end_date: result.result.rows[0].rent_end_date,
                total_price: Number(result.result.rows[0].total_price),
                status: result.result.rows[0].status,
                vehicle: {
                    vehicle_name: result.vehicleCheck.rows[0].vehicle_name,
                    daily_rent_price: Number(result.vehicleCheck.rows[0].daily_rent_price),
                }
            },
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getAllBookings = async (req: Request, res: Response) => {
    try {
            const tokenUser = req.user;

            if (!tokenUser) {
                return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const result = await bookingServices.getAllBookings();
        if (tokenUser.role === "admin") {
            res.status(200).json({
                success: true,
                message: "All bookings retrieved successfully",
                data: result.rows.map((booking) => ({
                    id: booking.booking_id,
                    customer_id: booking.customer_id,
                    vehicle_id: booking.vehicle_id,
                    rent_start_date: booking.rent_start_date,
                    rent_end_date: booking.rent_end_date,
                    total_price: Number(booking.total_price),
                    status: booking.status,
                    customer: {
                        name: booking.customer_name,
                        email: booking.customer_email,
                    },
                    vehicle: {
                        vehicle_name: booking.vehicle_name,
                        registration_number: booking.registration_number,
                    }
                })),
            });
        } else {
            // customer can see only their bookings
            const customerBookings = result.rows.filter(booking => booking.customer_email === tokenUser.email);
            res.status(200).json({
                success: true,
                message: "Your bookings retrieved successfully",
                data: customerBookings.map((booking) => ({
                    id: booking.booking_id,
                    customer_id: booking.customer_id,
                    vehicle_id: booking.vehicle_id,
                    rent_start_date: booking.rent_start_date,
                    rent_end_date: booking.rent_end_date,
                    total_price: Number(booking.total_price),
                    status: booking.status,
                    vehicle: {
                        vehicle_name: booking.vehicle_name,
                        registration_number: booking.registration_number,
                        type: booking.type,
                    }
                })),
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.bookingId);
        const { status } = req.body;
        const result = await bookingServices.updateBookingStatus(id, status);
        if(status === "cancelled"){
            res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: {
                    id: result.rows[0].id,
                    customer_id: result.rows[0].customer_id,
                    vehicle_id: result.rows[0].vehicle_id,
                    rent_start_date: result.rows[0].rent_start_date,
                    rent_end_date: result.rows[0].rent_end_date,
                    total_price: Number(result.rows[0].total_price),
                    status: result.rows[0].status,
                },
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Booking marked as returned. Vehicle is now available",
                data: {
                    id: result.rows[0].id,
                    customer_id: result.rows[0].customer_id,
                    vehicle_id: result.rows[0].vehicle_id,
                    rent_start_date: result.rows[0].rent_start_date,
                    rent_end_date: result.rows[0].rent_end_date,
                    total_price: Number(result.rows[0].total_price),
                    status: result.rows[0].status,
                    vehicle: {
                        availability_status: "available",
                    }
                },
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
export const bookingControllers = {
    createBooking,
    getAllBookings,
    updateBookingStatus,
};