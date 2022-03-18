import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import Template from './../template';
import userRoutes from './routes/user.routes';
import devBundle from './devBundle';
// modules for serverside rendering
import React from 'react'
import ReactDOMServer from 'react-dom/server';
import MainRouter from '../client/MainRouter';
import {StaticRouter} from 'react-router-dom';
import { ServerStyleSheets, ThemeProvider } from '@mui/material/styles';
import theme from './../client/theme';

const CURRENT_WORKING_DIR = process.cwd();

const app = express();

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));
devBundle.compile(app);

//parse body params and attach them to the req.body

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compress());
app.use(helmet());
app.use(cors());

app.use('/', userRoutes);

app.get('*', (req,res) => {
    const sheets = new ServerStyleSheets();
    const context = {};
    const markup = ReactDOMServer.renderToString(
        sheets.collect(
            <StaticRouter location={req.url} context={context}>
                <ThemeProvider theme={theme}>
                    <MainRouter/>
                </ThemeProvider>
            </StaticRouter>
        )
    );

    if (context.url) {
        return res.redirect(303, context.url);
    }

    const css = sheets.toString();

    res.status(200).send(Template({
        markup: markup,
        css: css
    }));
});

app.use((err,req,res,next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({"error" : err.name + ": " + err.message});
    } else if (err) {
        res.status(400).json({"error" : err.name + ": " + err.message});
        console.log(err);
    }
});

app.use((err,req,res,next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({"error":err.name + ": " + err.message});
    } else if (err) {
        res.status(400).json({"error": err.name + ": " + err.message});
        console.log(err);
    }
});

export default app;