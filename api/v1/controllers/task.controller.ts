import {Request, Response} from "express";
import Tasks from "../models/tasks.model"

//[GET] /api/v1/task
export const index = async (req: Request, res: Response):Promise<void> => {
    interface Find {
        deleted: boolean,
        status? : string,
        title? : unknown
    }
    
    let find: Find = {
        deleted: false
    }

    //status
    if(req.query.status){
        find.status = req.query.status.toString()
    }
    //end status

    //find
    // if(req.query.title){
    //     find.title = req.query.title
    // }
    //end find

    //Sort  
    const sort: { [key: string]: any } = {};
    if(req.query.sortKey && req.query.sortValue){
        const sortKey = req.query.sortKey.toLocaleString();
        sort[sortKey] = req.query.sortValue;
    }
    //end Sort
    console.log(find)
    const task = await Tasks.find(find).sort(sort);
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
