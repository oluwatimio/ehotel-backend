import express from "express";
import {verifySessionToken} from "../../services/FireAuth";
import {PostgreService} from "../../services/PostgreService";
const hotel = express.Router();
const postgreService = PostgreService.getIntance();

hotel.post("/hotel/add", (req, res) => {
    const parsed = req.body;
    verifySessionToken(parsed.token, parsed.ssn).then((verified: boolean) => {
        if  (verified) {
            postgreService.addHotel(parsed.hotelid, parsed.chainid, parsed.name, parsed.phone,
                parsed.email, parsed.rating, parsed.address, parsed.imagelink).then((response) => {
                res.json({result: "OK", payload: response});
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

hotel.get("/hotel/all", (req, res) => {
   postgreService.getAllHotels().then((response) => {
      res.json({result: "OK", payload: response});
   });
});

hotel.get("/hotel/dashboard/all", (req, res) => {
    const uid = req.query.uid;
    postgreService.getHotelsForDashboard(uid).then((val) => {
        res.json({result: "OK", payload: val.rows});
    });
});

hotel.get("/hotel/rooms/dashboard/all", (req, res) => {
    const uid = req.query.uid;
    postgreService.getRoomsForDashboard(uid).then((val) => {
        res.json({result: "OK", payload: val.rows});
    });
});

hotel.get( "/hotel/bookings", ( req, res ) => {
    const uid = req.query.uid;
    postgreService.getBookings(uid).then((val) => {
        // tslint:disable-next-line:no-console
        console.log(val.rows);
        res.json({result: "OK", payload: val.rows});
    });
});

module.exports = hotel;
