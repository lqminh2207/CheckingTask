import * as express from 'express';
import helmet from "helmet";
import * as cors from "cors";
import route from './routes';
const app = express();


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors());
app.use(helmet());

// Routes init
route(app);

// console.log('Running')
export default app