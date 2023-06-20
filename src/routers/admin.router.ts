import { Router } from "express";
import { BookController } from "../controllers/book.controller";
import permissionMiddleware from "../middlewares/permission.middleware";
export const adminRouter = Router();



adminRouter.get('/', BookController.getAllBook);
adminRouter.post('/', BookController.getAllBook);

adminRouter.use(permissionMiddleware);

adminRouter.get('/create', BookController.getCreatePage);
adminRouter.post('/create', BookController.createNewBook);
adminRouter.get('/update/:id', BookController.getUpdatePage);
adminRouter.post('/update/:id', BookController.updateBook);
adminRouter.get('/delete/:id', BookController.deleteBook);