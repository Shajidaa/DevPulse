import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { AuthRoutes } from "./modules/auth/auth.route";
import { IssueRoutes } from "./modules/issues/issues.route";

const app: Application = express();


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', AuthRoutes);
app.use('/api/issues', IssueRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'DevPulse API is running smoothly' });
});




export default app;