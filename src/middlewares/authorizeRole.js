import HttpError from "../utils/HttpError.js";

const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(HttpError(401, "Unauthorized"));
    }
    if (req.user.role !== requiredRole) {
      return next(
        HttpError(403, "Access denied: insufficient permissions to access"),
      );
    }
    next();
  };
};

export default authorizeRole;
