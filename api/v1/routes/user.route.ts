import { Router } from "express";
const router:Router = Router();
import * as controller from "../controllers/user.controller";
import * as userValidate from "../../../validate/user.validate"
import authMiddleware from '../../../middleware/auth.middleware';

router.post("/register", userValidate.register ,controller.register);
router.post("/login", userValidate.login, controller.login);
router.get("/detail", authMiddleware, controller.detail);

router.post("/password/forget", userValidate.forgetPassword, controller.forgetPassword);
router.post("/password/otp", userValidate.otpPassword, controller.otpPassword);
router.patch("/password/reset", userValidate.resetPassword, controller.resetPassword)

export const userRoutes: Router =  router;