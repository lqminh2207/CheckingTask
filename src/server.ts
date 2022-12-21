import * as express from 'express';
import helmet from "helmet";
import * as cors from "cors";
import route from './routes';
import { config } from 'dotenv'
import passport = require('passport');
import session = require('express-session');
import flash = require('express-flash');
const app = express();
config()
require('./app/strategies/google')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(flash())
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
  }));
app.use(passport.initialize())
app.use(passport.session())


app.use(cors());
app.use(helmet());

// Routes init
route(app);

// console.log('Running')
export default app