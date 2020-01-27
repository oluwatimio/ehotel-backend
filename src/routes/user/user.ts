import express from "express";
import {verifySessionToken} from "../../services/FireAuth";
import {PostgreService} from "../../services/PostgreService";
const user = express.Router();
const postgreService = PostgreService.getIntance();

user.post("/user", (req, res) => {
    const parsed = req.body;
    verifySessionToken(parsed.token, parsed.ssn).then((verified: boolean) => {
       if  (verified) {
           // tslint:disable-next-line:no-console
           postgreService.getUser(parsed.email).then((val) => {
               res.json({result: "OK", payload: val});
           });
       } else {
           // tslint:disable-next-line:no-console
           res.json({result: "TOKEN INCORRECT"});
       }
    }).catch((error) => {
        if (error.errorInfo.code === "auth/argument-error") {
            res.json({result: "TOKEN INCORRECT"});
        } else {
            res.json({result: error.errorInfo.code});
        }
    });
});

user.post( "/user/employee", ( req, res ) => {
    const parsed = req.body;
    verifySessionToken(parsed.token, parsed.essn).then((verified: boolean) => {
        if  (verified) {
            postgreService.getEmployee(parsed.email).then((val) => {
                res.json(val.rows);
            });
        } else {
            res.json({result: "TOKEN INCORRECT"});
        }
    }).catch((error) => {
        if (error.errorInfo.code === "auth/argument-error") {
            res.json({result: "TOKEN INCORRECT"});
        } else {
            res.json({result: error.errorInfo.code});
        }
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
    }).catch((error) => {
        if (error.errorInfo.code === "auth/argument-error") {
            res.json({result: "TOKEN INCORRECT"});
        } else {
            res.json({result: error.errorInfo.code});
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
    }).catch((error) => {
        if (error.errorInfo.code === "auth/argument-error") {
            res.json({result: "TOKEN INCORRECT"});
        } else {
            res.json({result: error.errorInfo.code});
        }
    });
});

module.exports = user;
