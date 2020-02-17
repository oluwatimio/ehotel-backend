import express from "express";
import {verifySessionToken} from "../../services/FireAuth";
import {PostgreService} from "../../services/PostgreService";
const chain = express.Router();
const postgreService = PostgreService.getIntance();

chain.post("/chain/add", (req, res) => {
   const parsed = req.body;
   postgreService.addHotelChain(parsed.chainid, parsed.name, parsed.numhotels, parsed.uid).then((response) => {
      res.json({result: "OK", payload: response});
   });
});

chain.get("/chain/all", (req, res) => {
   const uid = req.query.uid;
   postgreService.getAllHotelChainsForDashboard(uid).then((hotelChains: any) => {
      res.json({result: "OK", payload: hotelChains.rows});
   });
});

module.exports = chain;
