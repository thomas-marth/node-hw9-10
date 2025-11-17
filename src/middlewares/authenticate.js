import jwt from "jsonwebtoken";
import HttpError from "../utils/HttpError.js";
import User from "../db/models/User.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization) throw HttpError(401, "Authorization header missing");

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer")
    throw HttpError(401, "Authorization header must have Bearer type");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) throw HttpError(401, "User not found");
    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch (error) {
    throw HttpError(401, error.message);
  }
};

export default authenticate;
