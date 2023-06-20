import { Router } from "express";
import passport from "../middlewares/auth.middleware";
import { AuthController } from "../controllers/auth.controller";
export const authRouter = Router();

authRouter.get('/login', AuthController.getFormLogin);
authRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/book',
    failureRedirect: '/login'
}));

authRouter.get('/logout', (req, res, next)=>{
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

