import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.services";

const vehicles = async (req: Request, res: Response) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    try {
        const result = await vehicleServices.vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: {
              id : result.rows[0].id,
              vehicle_name: result.rows[0].vehicle_name,
              type: result.rows[0].type,
              registration_number: result.rows[0].registration_number,
              daily_rent_price: Number(result.rows[0].daily_rent_price),
              availability_status: result.rows[0].availability_status,
            },
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getAllVehicles();
        if (result.rows.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No vehicles found",
                data: [],
            });
        }
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows.map((vehicle) => ({
                    id: vehicle.id,
                    vehicle_name: vehicle.vehicle_name,
                    type: vehicle.type,
                    registration_number: vehicle.registration_number,
                    daily_rent_price: Number(vehicle.daily_rent_price),
                    availability_status: vehicle.availability_status,
                })),
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getOneVehicle = async (req: Request, res: Response) => {
    const id = Number(req.params.vehicleId);
    try {
        const result = await vehicleServices.getOneVehicle(id);
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: {
                id: result.rows[0].id,
                vehicle_name: result.rows[0].vehicle_name,
                type: result.rows[0].type,
                registration_number: result.rows[0].registration_number,
                daily_rent_price: Number(result.rows[0].daily_rent_price),
                availability_status: result.rows[0].availability_status,
            },
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateVehicle = async (req: Request, res: Response) => {
    const id = Number(req.params.vehicleId);
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    try {
        const result = await vehicleServices.updateVehicle(id, vehicle_name, type, registration_number, daily_rent_price, availability_status);
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: {
                id: result.rows[0].id,
                vehicle_name: result.rows[0].vehicle_name,
                type: result.rows[0].type,
                registration_number: result.rows[0].registration_number,
                daily_rent_price: Number(result.rows[0].daily_rent_price),
                availability_status: result.rows[0].availability_status,
            },
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const deleteVehicle = async (req: Request, res: Response) => {
    const id = Number(req.params.vehicleId);
    try {
        await vehicleServices.deleteVehicle(id);
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const vehicleControllers = {
  vehicles,
  getAllVehicles,
  getOneVehicle,
  updateVehicle,
  deleteVehicle,
};