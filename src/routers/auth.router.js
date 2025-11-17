import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import {
  registerController,
  loginController,
  changeEmailController,
  changePasswordController,
  deleteAccountController,
  updateRoleController,
  refreshTokenController,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/change-email", authenticate, changeEmailController);
authRouter.post("/change-password", authenticate, changePasswordController);
authRouter.get("/admin", authenticate, authorizeRole("admin"), (req, res) => {
  res.json({ message: "Hello, admin!" });
});
authRouter.delete("/delete-account", authenticate, deleteAccountController);
authRouter.patch(
  "/update-role",
  authenticate,
  authorizeRole("admin"),
  updateRoleController,
);

authRouter.post("/refresh-token", authenticate, refreshTokenController);

export default authRouter;
