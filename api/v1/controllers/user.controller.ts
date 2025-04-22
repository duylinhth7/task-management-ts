import { Request, Response } from "express"
import md5 from "md5"
import User from "../models/user.model";
import * as genarate from "../../../helpers/genarate";
import sendMailHelper from "../../../helpers/sendMail";
import { genarateNumber } from "../../../helpers/genarate";
import ForgetPassword from "../models/forget-password.model";


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

// [POST] /api/v1/user/password/forget
export const forgetPassword = async (req:Request, res: Response) => {
    try {
        const email:string = req.body.email;
        const checkEmail  = await User.findOne({
            email: email,
            deleted: false
        });
        if(!checkEmail){
            res.json({
                code: 400,
                message: "Email không hợp lệ!"
            });
            return
        };
        const otp:string = genarateNumber(5);
        interface ObjectForgetPassword{
            email: string,
            otp: string,
            expireAt: Date
        }
        const objectForgetPassword:ObjectForgetPassword = {
            email: email,
            otp: otp,
            expireAt: new Date()
        };
        const forgetPassword = new ForgetPassword(objectForgetPassword);
        await forgetPassword.save();

        //Gửi mail xác nhận OTP;
        const subject = "Mã OTP xác minh đặt lại mật khẩu!";
        const html = `Mã OTP để cập nhật lại mật khẩu là <b>${otp}</b>. Thời hạn của mã OTP này là 5 phút!`
        sendMailHelper(email, subject, html);
        res.json({
            code: 200,
            message: `Đã gửi mã OTP qua email ${email}`
        })
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
}

// [POST] /api/v1/user/password/otp
export const otpPassword =  async (req:Request, res: Response) => {
    try {
        const otp:string = req.body.otp;
        const email:string = req.body.email;
        const checkOtp = await ForgetPassword.findOne({
            email: email,
            otp: otp
        });
        if(!checkOtp){
            res.json({
                code: 400,
                message: "Không tồn tại!"
            });
            return;
        } else {
            const user = await User.findOne({
                email: email
            });
            res.cookie("token", user.token);
            res.json({
                code: 200,
                message: "OTP hợp lệ"
            });
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        }); return;
    }
}

//[PATCH] /api/v1/user/password/reset
export const resetPassword =  async (req:Request, res: Response) => {
    try {
        const password:string = md5(req.body.password);
        const  token:string = req.cookies.token;
        await User.updateOne({
            token: token
        }, {
            password: password
        });
        res.json({
            code: 200,
            message: "Đổi mật khẩu thành công!"
        })
    } catch (error) {
        res.json({
            code: 200,
            message: "Lỗi!"
        })
    }    
}