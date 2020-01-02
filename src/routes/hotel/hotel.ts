import express from "express";
import {PostgreService} from "../../services/PostgreService";
const hotel = express.Router();
const postgreService = PostgreService.getIntance();

hotel.post("/hotel/add", (req, res) => {
    const parsed = req.body;
    postgreService.addHotel(parsed.hotelid, parsed.chainid, parsed.name, parsed.phone,
        parsed.email, parsed.rating, parsed.address).then((response) => {
        res.json({result: "OK", payload: response});
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
