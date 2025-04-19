import { Express } from 'express'
import { taskRoutes } from './task.route';

const indexRouterV1 = (app: Express) => {
    const pathV1 = "/api/v1";
    app.use(pathV1 + "/task", taskRoutes)
}
export default indexRouterV1;