import {Request, Response} from "express";
import Tasks from "../models/tasks.model"
import panigationHelper from "../../../helpers/panigation";
import searchHelper from "../../../helpers/search";
//[GET] /api/v1/task
export const index = async (req: Request, res: Response):Promise<void> => {
    interface Find {
        deleted: boolean,
        status? : string,
        title? : RegExp
    }
    
    let find: Find = {
        deleted: false
    }

    //status
    if(req.query.status){
        find.status = req.query.status.toString()
    }
    //end status

    //Sort  
    const sort: { [key: string]: any } = {};
    if(req.query.sortKey && req.query.sortValue){
        const sortKey = req.query.sortKey.toLocaleString();
        sort[sortKey] = req.query.sortValue;
    }
    //end Sort

    //Panigation
    const countTasks:number = await Tasks.countDocuments(find);
    const objectPanigation = panigationHelper(
        {
            currentPage: 1,
            limitItems: 2
        },  
        req.query,
        countTasks
    );
    //End Panigation

    //Search
    let objectSearch = searchHelper(req.query);
    if(req.query){
        find.title = objectSearch.regex
    }
    //end search
    const task = await Tasks.find(find).skip(objectPanigation.skipItems as number).limit(objectPanigation.limitItems).sort(sort);
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


//[PATCH] /api/v1/task/change-status/:id
export const changeStatus = async (req:Request, res:Response):Promise<void> => {
    try {
        const id:string = req.params.id;
        const status:string = req.body.status;
        if(req.body.status){
            await Tasks.updateOne({
                _id: id
            }, {
                status: status 
            })
        };
        res.json({
            code: 200,
            message: "Cập nhật thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
}