import "reflect-metadata";
import { createConnection, Repository, Connection } from "typeorm";
import * as express from "express";
import * as session from "express-session";
import * as cors from "cors";
import { DataBalita } from "./entity/DataBalita";
import { User } from "./entity/User";
import { BBLookUp } from "./entity/BBLookUp";

// Routes..
import landing from "./routes/landing";
import appRoutes from "./routes/app";
import adminRoutes from "./routes/admin";
import apiRoutes from "./routes/api";

declare global {
  namespace Express {
    export interface Request {
      db: {
        repoBalita: Repository<DataBalita>,
        repoUser: Repository<User>,
        repoBB: Repository<BBLookUp>,
        conn: Connection
      }
    }
  }
}

async function bootstrap() {
  const connection = await createConnection();
  const app = express();

  // Configuration
  app.set('view engine', 'pug');
  app.disable('view cache');

  app.use(cors());
  app.use(session({
    secret: 'foobar',
    resave: false
  }));

  app.use((req, resp, next) => {
    req.db = {
      repoBalita: connection.getRepository<DataBalita>(DataBalita),
      repoUser: connection.getRepository<User>(User),
      repoBB: connection.getRepository<BBLookUp>(BBLookUp),
      conn: connection
    };
    next();
  });

  // app.use("/app", (req, resp, next) => {
  //   if (!req.session.userid)  {
  //     resp.redirect("/login");
  //   }
  //   next();
  // });


  // Register routes
  apiRoutes(app);
  adminRoutes(app);

  // Static files at the end
  app.use(express.static('static'));

  app.listen(5000, (err) => {
    console.log(err);
    console.log("listening at 5000");
  });
}

bootstrap();