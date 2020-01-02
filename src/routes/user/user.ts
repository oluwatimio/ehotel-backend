import express from "express";
import {verifySessionToken} from "../../services/FireAuth";
import {PostgreService} from "../../services/PostgreService";
const user = express.Router();
const postgreService = PostgreService.getIntance();

user.post("/user", (req, res) => {
    const parsed = req.body;

    verifySessionToken(parsed.token, parsed.ssn).then((verified: boolean) => {
       if  (verified) {
           postgreService.getUser(parsed.email).then((val) => {
               res.json({result: "OK", payload: val});
           });
       } else {
           res.json({result: "TOKEN INCORRECT"});
       }
    });
});

user.get("/user/all", (req, res) => {
    postgreService.getUsers().then((val) => {
        res.json(val.rows);
    });
});

user.post( "/user/employee", ( req, res ) => {
    const parsed = req.body;
    postgreService.getEmployee(parsed.email).then((val) => {
        res.json(val.rows);
    });
});

user.post( "/user/add", ( req, res ) => {
    const parsed = req.body;
    verifySessionToken(parsed.token, parsed.ssn).then((verified: boolean) => {
        if (verified) {
            postgreService.addCustomer(parsed.email,
                parsed.ssn, "", parsed.firstname, parsed.lastname, "");
            res.json({result: "OK", payload: parsed});
        } else {
            res.json({result: "TOKEN INCORRECT"});
        }
    });
});

user.post("/user/employee/add", (req, res) => {
    const parsed = req.body;

    verifySessionToken(parsed.token, parsed.essn).then((verified: boolean) => {
        if (verified) {
            postgreService.addEmployee(parsed.email, parsed.pass,
                parsed.essn, parsed.name, parsed.position);
            res.json({result: "OK", payload: parsed});
        } else {
            res.json({result: "TOKEN INCORRECT"});
        }
    });
});

user.get("/user/employees/all", (req, res) => {
    postgreService.getEmployees().then((val) => {
        res.json(val.rows);
    });
});

module.exports = user;
