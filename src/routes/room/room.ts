import express from "express";
import {PostgreService} from "../../services/PostgreService";
const room = express.Router();
const postgreService = PostgreService.getIntance();

room.post("/room/add", (req, res) => {
    const parsed = req.body;
    postgreService.addRoom(parsed.hotelid, parsed.roomid,
        parsed.ammenities, parsed.damages, parsed.price, parsed.view, parsed.capacity,
        parsed.extension, parsed.roomnumber).then((response) => {
        res.json({result: "OK", payload: response});
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
    postgreService.addBooking(parsed.bid, parsed.roomid, parsed.ssn, parsed.hotelid,
        parsed.fullname).then((response) => {
        res.json({result: "OK", payload: response});
    });
});

room.post("/room/rental/add", (req, res) => {
    const parsed = req.body;
    postgreService.addRental(parsed.bid);
});

module.exports = room;
