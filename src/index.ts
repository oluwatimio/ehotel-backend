//tslint:disable
import express from "express";
import bodyParser from "cookie-parser"
import {TableCreator} from "./services/TableCreator";
import {TriggerCreator} from "./services/TriggerCreator";
import {PostgreService} from "./services/PostgreService";
const app = express();
app.use(express.json());

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(require('./routes/routes'));
const port = 8080; // default port to listen
const tableCreator = new TableCreator();
const triggerCreator = new TriggerCreator();
tableCreator.createTables();
triggerCreator.addTriggers();

// let ps = PostgreService.getIntance().getUser("test2@gmail.com");
// ps.then((result) => {
//     console.log(result);
// });
// // define a route handler for the default home page

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
});
