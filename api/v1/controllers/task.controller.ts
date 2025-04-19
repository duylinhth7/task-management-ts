import {Request, Response} from "express";
import Tasks from "../models/tasks.model"

//[GET] /api/v1/task
export const index = async (req: Request, res: Response):Promise<void> => {
    const task = await Tasks.find({
        deleted: false
    });
    res.json(task)
}

//[GET]  /api/v1/task/detail/:id
export const detail = async (req:Request, res: Response):Promise<void> => {
    const id:string= req.params.id
    const task = await Tasks.findOne({
        _id: id,
        deleted: false
    });
    res.json(task)
}
