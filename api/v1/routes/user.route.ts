import { Router } from "express";
const router:Router = Router();
import * as controller from "../controllers/user.controller";
import * as userValidate from "../../../validate/user.validate"
import authMiddleware from '../../../middleware/auth.middleware';

router.post("/register", userValidate.register ,controller.register);
router.post("/login", userValidate.login, controller.login);
router.get("/detail", authMiddleware, controller.detail)

export const userRoutes: Router =  router;