import {
  register,
  login,
  changePassword,
  changeEmail,
  deleteAccount,
  updateRole,
  refreshToken,
} from "../services/auth.service.js";
import validateBody from "../utils/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/auth.schemas.js";

export const registerController = async (req, res) => {
  validateBody(registerSchema, req.body);
  await register(req.body);

  res.status(201).json({
    message: "Register successfully",
  });
};

export const loginController = async (req, res) => {
  validateBody(loginSchema, req.body);
  const result = await login(req.body);

  res.json(result);
};

export const changeEmailController = async (req, res) => {
  const { newEmail, password } = req.body;
  const result = await changeEmail(req.user.id, newEmail, password);
  res.json(result);
};

export const changePasswordController = async (req, res) => {
  const { newPassword } = req.body;
  const result = await changePassword(req.user.id, newPassword);
  res.json(result);
};

export const deleteAccountController = async (req, res) => {
  const { password } = req.body;
  const result = await deleteAccount(req.user.id, password);
  res.json(result);
};

export const updateRoleController = async (req, res) => {
  const { userId, role } = req.body;
  const result = await updateRole(userId, role);
  res.json(result);
};

export const refreshTokenController = async (req, res) => {
  const result = await refreshToken(req.user);
  res.json(result);
};
