import express from "express";
import {verifySessionToken} from "../../services/FireAuth";
import {PostgreService} from "../../services/PostgreService";
const chain = express.Router();
const postgreService = PostgreService.getIntance();

chain.post("/chain/add", (req, res) => {
   const parsed = req.body;
   verifySessionToken(parsed.token, parsed.ssn).then((verified: boolean) => {
      if  (verified) {
         postgreService.addHotelChain(parsed.chainid, parsed.name, parsed.numhotels, parsed.uid).then((response) => {
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

chain.get("/chain/all", (req, res) => {
   const uid = req.query.uid;
   postgreService.getAllHotelChainsForDashboard(uid).then((hotelChains: any) => {
      res.json({result: "OK", payload: hotelChains.rows});
   });
});

module.exports = chain;
