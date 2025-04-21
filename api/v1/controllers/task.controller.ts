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
    if(req.query.keyword){
        let objectSearch = searchHelper(req.query);
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

//[PATCH] api/v1/task/change-mutil
export const changeMutil = async (req:Request, res:Response):Promise<void> => {
    enum Key {
        STATUS = "status",
        DELETE = "delete"
    };
    try {
        const ids: string[] = req.body.ids;
        const key:string = req.body.key;
        const value:string = req.body.value;
        switch(key){
            case Key.STATUS:
                await Tasks.updateMany({
                    _id: {$in: ids},
                }, {
                    status: value
                });
                res.json({
                    code: 200,
                    message: "Cập nhật thành công!"
                }); 
                break;
            case Key.DELETE:
                await Tasks.updateMany({
                    _id: {$in: ids},
                }, {
                    deleted: true,
                    deletedAt: new Date
                });
                res.json({
                    code: 200,
                    message: "Xóa thành công!"
                }); 
                break;
            default:
                break;
        }

    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
}

//[POST] api/v1/task/create
export const create = async (req:Request, res:Response):Promise<void> => {
    try {
        const newTask = new Tasks(req.body);
        await newTask.save();
        res.json({
            code: 200,
            message: "Tạo mới thành công",
            newTask: newTask
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
}

// [PATCH] /api/v1/task/edit/:id
export const edit = async (req:Request, res:Response):Promise<void> => {
    try {
        const id:string = req.params.id;
        await Tasks.updateOne({
            _id: id
        }, req.body);
        res.json({
            code: 200,
            message: "Chỉnh sửa thành công!"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
}

// [DELETE] /api/v1/task/delete/:id
export const deleteTask = async (req:Request, res:Response):Promise<void> => {
    try {
        const id:string = req.params.id;
        await Tasks.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date
        });
        res.json({
            code: 200,
            message: "Xóa thành công!"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }    
}