import dotenv from 'dotenv';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import cors from 'cors';
import session from 'express-session';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const sess: session.SessionOptions = {
    secret: 'TutorLoL',
    resave: false,
    saveUninitialized: true,
    cookie: {}
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    if (sess.cookie) { sess.cookie.secure = true; }
}
app.use(session(sess));

app.use(express.static('public'));
app.use(express.static('examples'));

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api')) { return next(); }
    res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'));
});

app.use('/api', routes);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (req.app.get('env') === 'development') {
        console.log('Error Path: ', req.path);
        console.log(error);
    }

    const myError = {
        success: error.statusCode === 200,
        statusCode: error.statusCode || 500,
        message: error.message
    };
    console.log(myError);

    res.locals.message = error.message;
    res.locals.error = req.app.get('env') === 'development' ? error : {};

    res.status(myError.statusCode).send(myError);
});

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
});