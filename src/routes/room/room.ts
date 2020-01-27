import express from "express";
import {verifySessionToken} from "../../services/FireAuth";
import {PostgreService} from "../../services/PostgreService";
const room = express.Router();
const postgreService = PostgreService.getIntance();

room.post("/room/add", (req, res) => {
    const parsed = req.body;
    verifySessionToken(parsed.token, parsed.ssn).then((verified: boolean) => {
        if  (verified) {
            postgreService.addRoom(parsed.hotelid, parsed.roomid,
                parsed.ammenities, parsed.damages, parsed.price, parsed.view, parsed.capacity,
                parsed.extension, parsed.roomnumber).then((response) => {
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

room.get( "/room/available", ( req, res ) => { // get all available rooms
    const hotelid = req.query.hotelid;
    postgreService.getAvailableRooms(hotelid).then((val) => {
        res.json({result: "OK", payload: val});
    });
});

room.post("/room/book", (req, res) => {
    const parsed = req.body;
    verifySessionToken(parsed.token, parsed.ssn).then((verified: boolean) => {
        if  (verified) {
            postgreService.addBooking(parsed.bid, parsed.roomid, parsed.ssn, parsed.hotelid,
                parsed.fullname).then((response) => {
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

module.exports = room;
