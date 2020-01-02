/* tslint:disable */
import express from "express";
import {PostgreService} from "../services/PostgreService";
const index = express.Router();

const postgreService = PostgreService.getIntance();
index.use(require("./chain/chain"));
index.use(require("./hotel/hotel"));
index.use(require("./user/user"));
index.use(require("./room/room"));
// postgreService.addChains();
// postgreService.addHotels();
// postgreService.addRooms();
// postgreService.addChains();
index.get( "/", ( req, res ) => {
    res.send( "Welcome to E-HOTEL API" );
});

index.get( "/id/generate", ( req, res ) => {
    res.send( "Hello world!" );
});

module.exports = index;