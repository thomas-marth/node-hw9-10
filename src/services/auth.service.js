import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../db/models/User.js";
import HttpError from "../utils/HttpError.js";

const { JWT_SECRET } = process.env;

export const findUser = (query) => User.findOne(query);

export const register = async ({ email, password, username }) => {
  const user = await findUser({ where: { email } });
  if (user) throw HttpError(409, "Email already in use");

  const hashPassword = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hashPassword });
};

export const login = async ({ email, password }) => {
  const user = await findUser({ where: { email } });

  if (!user) throw HttpError(401, "Email or password invalid");

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, "Email or password invalid");

  if (user.mustChangePassword) {
    throw HttpError(403, "You must change your password before login");
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "24h",
  });

  user.token = token;

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  };
};

export const changeEmail = async (userId, newEmail, password) => {
  if (!newEmail || !password)
    throw HttpError(400, "New email and password are required");

  const user = await User.findByPk(userId);
  if (!user) throw HttpError(401, "User not found");

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, "Invalid password");

  const exists = await User.findOne({ where: { email: newEmail } });
  if (exists) throw HttpError(409, "Email already registered");

  await user.update({ email: newEmail });

  return { message: "Email successfully changed", email: user.email };
};

export async function changePassword(userId, newPassword) {
  const user = await User.findByPk(userId);
  if (!user) throw HttpError(401, "User not found");

  const hashPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashPassword;
  await user.update({ password: hashPassword, mustChangePassword: false });

  return { message: "Password successfully changed" };
}

export const deleteAccount = async (userId, password) => {
  const user = await User.findByPk(userId);
  if (!user) throw HttpError(401, "User not found");

  const hashPassword = await bcrypt.compare(password, user.password);
  if (!hashPassword) throw HttpError(401, "Invalid password");

  await user.destroy();
  return { message: "Account successfully deleted" };
};

export const updateRole = async (userId, role) => {
  if (!userId || !role) throw HttpError(400, "userId and role are required");
  const user = await User.findByPk(userId);
  if (!user) throw HttpError(404, "User not found");

  user.role = role;
  await user.save();

  return {
    message: "Role successfully updated",
    user: { id: user.id, role: user.role },
  };
};

export const refreshToken = async (user) => {
  const { email, username, id } = user;
  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "24h" });
  user.token = token;
  await user.save();

  return {
    token,
    user: {
      email,
      username,
    },
  };
};
