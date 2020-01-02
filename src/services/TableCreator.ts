import {Client} from "pg";
import {ClientMaker} from "./ClientMaker";

export class TableCreator {
    private client: Client;
    // tslint:disable-next-line:no-empty
    constructor() {
        this.client = ClientMaker.getIntance().getClient();
    }
    public createTables(): void {
        this.createHotelChainTable();
        this.createHotelTable();
        this.createEmployeeTable();
        this.createRoomTable();
        this.createCustomerTable();
        this.createBookingTable();
        this.createRentalTable();
    }

    private createHotelChainTable() {
        const queryString = "CREATE TABLE IF NOT EXISTS HotelChains(CHAINID VARCHAR(255) PRIMARY KEY, " +
            "NAME VARCHAR(255) not null, " +
            "UID VARCHAR(255) not null," +
            "numHotels SERIAL)";
        this.client.query(queryString, (err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }
    private createHotelTable() {
        const queryString = "CREATE TABLE IF NOT EXISTS Hotel(HOTELID VARCHAR(255) PRIMARY KEY NOT NULL, " +
            "CHAINID VARCHAR(255) NOT NULL," +
            "NAME VARCHAR(255) not null, " +
            "PHONE SERIAL," +
            "EMAIL VARCHAR(255)," +
            "RATING SERIAL," +
            "ADDRESS VARCHAR(255)," +
            "numrooms SERIAL not null," +
            "numbookings SERIAL not null," + // Update every other hotel add stuff
            "CONSTRAINT hotelchain_chain_id_fkey FOREIGN KEY (CHAINID)  " +
            "REFERENCES HotelChains (CHAINID))";
        this.client.query(queryString, (err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }

    private createEmployeeTable() {
        const queryString = "CREATE TABLE IF NOT EXISTS Employee(ESSN VARCHAR(255) PRIMARY KEY NOT NULL, " +
            "NAME VARCHAR(255) NOT NULL," +
            "ROLE VARCHAR(255) NOT NULL," +
            "Email VARCHAR(255) NOT NULL)";
        this.client.query(queryString, (err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }

    private createRoomTable() {
        const queryString = "CREATE TABLE IF NOT EXISTS Room(ROOMID VARCHAR(255) PRIMARY KEY NOT NULL, " +
            "ROOMNUMBER INTEGER NOT NULL," +
            "AMMENITIES VARCHAR(255) NOT NULL," +
            "DAMAGES VARCHAR(255) NOT NULL," +
            "HOTELID VARCHAR(255) NOT NULL," +
            "PRICE DECIMAL NOT NULL," +
            "VIEW VARCHAR(255) NOT NULL," +
            "CAPACITY INTEGER NOT NULL," +
            "BOOKED BOOLEAN NOT NULL," +
            "EXTENSION BOOLEAN NOT NULL," +
            "CONSTRAINT hotelid_fkey FOREIGN KEY (HOTELID)  " +
            "REFERENCES Hotel (HOTELID))";
        this.client.query(queryString, (err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }

    private createBookingTable() {
        const queryString = "CREATE TABLE IF NOT EXISTS Booking(bID VARCHAR(255) PRIMARY KEY NOT NULL, " +
            "roomid VARCHAR(255) NOT NULL, " +
            "SSN VARCHAR(255) NOT NULL, hotelid VARCHAR(255) NOT NULL," +
            "FULLNAME VARCHAR(255) NOT NULL," +
            "CONSTRAINT roomid_fkey FOREIGN KEY (roomid) " +
            "REFERENCES Room (roomid)," +
            "CONSTRAINT ssn_fkey FOREIGN KEY (SSN) REFERENCES Customer(SSN)," +
            "CONSTRAINT hotelid_fkey FOREIGN KEY (hotelid) REFERENCES Hotel(hotelid))";
        this.client.query(queryString, (err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }

    private createRentalTable() {
        const queryString = "CREATE TABLE IF NOT EXISTS Rental(bid VARCHAR(255) NOT NULL, " +
            "CONSTRAINT bid_fkey FOREIGN KEY (bid) " +
            "REFERENCES Booking (bid))";
        this.client.query(queryString, (err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }

    private createCustomerTable() {
        const queryString = "CREATE TABLE IF NOT EXISTS Customer(SSN VARCHAR(255) PRIMARY KEY NOT NULL, " +
            "dateOfRegistering VARCHAR(255) NOT NULL," +
            "ADDRESS VARCHAR(255) NOT NULL," +
            "FirstName VARCHAR(255) NOT NULL," +
            "LastName VARCHAR(255) NOT NULL," +
            "Email VARCHAR(255) NOT NULL)";
        this.client.query(queryString, (err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }
}
