import { Request, Response } from "express"
const md5 = require("md5") //do lỗi không import được
import User from "../models/user.model";
import * as genarate from "../../../helpers/genarate"


// [POST] /api/v1/user/create
export const register = async (req:Request, res:Response):Promise<void> => {
    try {
        const email:string = req.body.email;
        req.body.password = md5(req.body.password);
        const exitsEmail = await User.findOne({
            email: email
        });
        if(exitsEmail){
            res.json({
                code: 400,
                message: "Email này đã tồn tại!"
            });
            return;
        } else {
            req.body.token = genarate.genarateToken(30);
            const newUser = new User(req.body);
            await newUser.save();
            res.cookie("token", newUser.token);
            res.json({
                code: 200,
                message: "Tạo tài khoản thành công!",
                user: newUser
            })
        }

    } catch (error) {
        res.json({
            code: 200,
            message: "Lỗi!"
        })
    }
}

//[POST] //api/v1/user/login
export const login = async (req:Request, res:Response):Promise<void> => {
    try {
        const email:string = req.body.email;
        const password:string = md5(req.body.password);
        const checkEmail = await User.findOne({
            email: email,
            deleted: false,
            status: "active"
        });
        if(!checkEmail){
            res.json({
                code: 400,
                message: "Email không hợp lệ!"
            });
            return;
        };
        if(checkEmail.password != password){
            res.json({
                code: 400,
                message: "Sai mật khẩu"
            });
            return;
        }
        res.cookie("token", checkEmail.token);
        res.json({
            code: 200,
            message: "Đăng nhập thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        });
    }
}
//[GET] /api/v1/user/detail
export const detail = async (req:Request, res:Response):Promise<void> => {
    try {
        res.json({
            code: 200,
            message: "Thành công!",
            info: req["user"]
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
}