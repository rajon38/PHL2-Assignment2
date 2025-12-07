import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const phone = req.body.phone || '';
    const role = req.body.role || 'customer';
    try {
        const result = await authServices.signupUser(name, email, password, phone, role);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
              id : result.rows[0].id,
              name: result.rows[0].name,
              email: result.rows[0].email,
              phone: result.rows[0].phone,
              role: result.rows[0].role,
            },
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.loginUser(email, password);

    if (result === null) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (result === false) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const { token, user } = result;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  signupUser,
  loginUser,
};