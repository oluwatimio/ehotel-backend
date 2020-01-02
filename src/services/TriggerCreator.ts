import {Client} from "pg";
import {ClientMaker} from "./ClientMaker";

export class TriggerCreator {
    private client: Client;

    // tslint:disable-next-line:no-empty
    constructor() {
        this.client = ClientMaker.getIntance().getClient();
    }

    public addTriggers(): void {
        this.hotelAddTriggerFunction();
        this.roomAddTriggerFunction();
        this.bookingAddTriggerFunction();
        this.hotelAddTrigger();
        this.roomAddTrigger();
        this.bookingAddTrigger();
    }

    private hotelAddTriggerFunction() {
        const qstring = `CREATE OR REPLACE FUNCTION updatechain()
        RETURNS trigger AS
        $BODY$
        BEGIN
        UPDATE HotelChains
        SET numHotels = numHotels + 1
        WHERE chainid = NEW.chainid;
        RETURN NEW;
        END;
        $BODY$
        LANGUAGE plpgsql VOLATILE
        COST 100;
        `;
        this.client.query(qstring, (err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }

    private bookingAddTriggerFunction() {
        const qstring = `CREATE OR REPLACE FUNCTION updatehotelandroomforbooking()
        RETURNS trigger AS
        $BODY$
        BEGIN
        UPDATE Hotel
        SET numbookings = numbookings + 1
        WHERE hotelid = NEW.hotelid;
        UPDATE Room
        SET booked = true
        WHERE roomid = NEW.roomid;
        RETURN NEW;
        END;
        $BODY$
        LANGUAGE plpgsql VOLATILE
        COST 100;
        `;
        this.client.query(qstring, (err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }

    private roomAddTriggerFunction() {
        const qstring = `CREATE OR REPLACE FUNCTION updateroom()
        RETURNS trigger AS
        $BODY$
        BEGIN
        UPDATE Hotel
        SET numrooms = numrooms + 1
        WHERE hotelid = NEW.hotelid;
        RETURN NEW;
        END;
        $BODY$

        LANGUAGE plpgsql VOLATILE
        COST 100;
        `;
        this.client.query(qstring, (err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }

    private hotelAddTrigger() {
        const queryString = "CREATE TRIGGER hotel_add " +
            "AFTER INSERT " +
            "ON Hotel " +
            "FOR EACH ROW " +
            "EXECUTE PROCEDURE updatechain()";
        this.client.query(queryString, (err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }

    private roomAddTrigger() {
        const queryString = "CREATE TRIGGER room_add " +
            "AFTER INSERT " +
            "ON Room " +
            "FOR EACH ROW " +
            "EXECUTE PROCEDURE updateroom()";
        this.client.query(queryString, (err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }

    private bookingAddTrigger() {
        const queryString = "CREATE TRIGGER booking_add " +
            "AFTER INSERT " +
            "ON Booking " +
            "FOR EACH ROW " +
            "EXECUTE PROCEDURE updatehotelandroomforbooking()";
        this.client.query(queryString, (err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }
}
