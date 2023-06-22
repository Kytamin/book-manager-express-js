import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import livereload from "connect-livereload";
import fileUpload from "express-fileupload";
import { DataBase } from "./src/models/database.model";
import { adminRouter } from "./src/routers/admin.router";
import { authRouter } from "./src/routers/auth.router";
import passport from "./src/middlewares/auth.middleware";

const PORT = 3000;
const app = express();

DataBase.connectDB()
        .then(() => console.log('DB Connected!'))
        .catch((err) => console.log(err.message));

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use(fileUpload({
        createParentPath: true
}));
app.use(express.static('./src/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
}));

app.use(livereload());
app.use(passport.initialize());
app.use(passport.session());


app.use('/auth',authRouter);
// viet middleware chinh sua res
app.use((req: any, res: any, next: any) => {
        if (req.isAuthenticated()) {
                res.locals.userLogin = req.user
                next();
        } else {
                res.redirect('/login')
        }
})
app.use('/book', adminRouter);

app.listen(PORT, 'localhost', () => console.log(`App is running at http://localhost:${PORT}`));