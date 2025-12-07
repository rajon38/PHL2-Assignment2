import { userServices } from "./users.services";
import { Request, Response } from "express";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows.map((user: any) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            })),
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.userId);
        const tokenUser = req.user;

        if (!tokenUser) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { name, phone, role } = req.body;
        const result = await userServices.updatedUser(id, name, phone, role);
        
        if (tokenUser.role === "customer" && tokenUser.email !== result.email) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this user",
            });
        }

        if (tokenUser.role === "admin") {
            //admin can update name , phone, role
            return res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: {
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    phone: result.phone,
                    role: result.role,
                },
            });
        } else if (tokenUser.role === "customer" && tokenUser.email === result.email) {
            //customer can update only name and phone
            return res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: {
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    phone: result.phone,
                    role: result.role,
                },
            });
        }

        return res.status(403).json({
            success: false,
            message: "You are not authorized to update this user",
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.userId);
        await userServices.deleteUser(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const userControllers = {
    getAllUsers,
    updateUser,
    deleteUser,
};