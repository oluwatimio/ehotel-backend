//tslint:disable
import {Client} from "pg";
import {ClientMaker} from "./ClientMaker";
export class PostgreService {
    private client: Client;
    private static instance: PostgreService;
    private constructor() {
        this.client = ClientMaker.getIntance().getClient();
    }

    public static getIntance(): PostgreService {

        if (!PostgreService.instance) {
            PostgreService.instance = new PostgreService();
        }
        return PostgreService.instance;
    }

    public addCustomer(email: string, SSN: string,
                       DOR: string, FN: string, ln: string, addy: string) {
        const queryString = "INSERT INTO Customer (ssn," +
            "dateofregistering," +
            "address, firstname, lastname, email)" +
            "VALUES($1,$2,$3,$4,$5,$6)";
        this.client.query(queryString, [SSN, DOR, addy, FN, ln, email],(err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }

    public addEmployee(email: string, password: string, ESSN: number, NAME: string, POSITION: string) {
        const queryString = "INSERT INTO Employee (essn," +
            "name," +
            "role, email)" +
            "VALUES($1,$2,$3,$4)";
        this.client.query(queryString, [ESSN, NAME, POSITION, email],(err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }
    public addHotelChain(chainId: string, name: string, numHotels: number, uid: string) {
        return new Promise((resolve) => {
            const queryString = "INSERT INTO HotelChains (chainid," +
                "name," +
                "uid, numHotels)" +
                "VALUES($1,$2,$3, $4)";
            this.client.query(queryString, [chainId, name, uid, numHotels],(err, res) => {
                // tslint:disable-next-line:no-console
                console.log(err, res);
                resolve({chainid: chainId, name: name, numhotels: numHotels, uid: uid})
            });
        })
    }

    public addHotel(hotelId: string, chainId: string, name: string,
                    phone: string, email: string, rating: number, address: string, imageLink: string) {
        return new Promise(resolve => {
            const queryString = "INSERT INTO Hotel (hotelid, chainid," +
                "name, phone, email, rating, address, numrooms, numbookings, imageLink)" +
                "VALUES($1,$2,$3,$4,$5,$6,$7, $8, $9, $10)";
            this.client.query(queryString, [hotelId, chainId, name, phone, email, rating, address, 0,0, imageLink], (err, res) => {
                // tslint:disable-next-line:no-console
                console.log(err, res);
                resolve({hotelid: hotelId, name: name, numrooms: 0, address: address, numbookings: 0})
            });
        })
    }

    public addRoom(hotelid: string, roomid: string, ammenities: string,
                   damages: string, price: number, view: string, capacity: number, extension: boolean, roomnumber: number) {
        return new Promise(resolve => {
            const queryString = "INSERT INTO Room (roomid, roomnumber, ammenities," +
                "damages, hotelId, price, view, capacity, booked, extension)" +
                "VALUES($1,$2,$3,$4,$5,$6,$7,$8, $9, $10)";
            this.client.query(queryString, [roomid, roomnumber, ammenities, damages, hotelid, price, view, capacity, false, extension], (err, res) => {
                // tslint:disable-next-line:no-console
                console.log(err, res);
                resolve({roomid: roomid, roomnumber: roomnumber, hotelid: hotelid, price: price, capacity: capacity, booked: false})
            });
        });
    }

    public addBooking(bid: string, roomId: string, ssn: string, hotelid: string, fullname: string) {
        return new Promise(resolve => {
            const queryString = "INSERT INTO Booking (bid, roomid, ssn, hotelid, fullname)" +
                "VALUES($1,$2, $3, $4, $5)";
            this.client.query(queryString, [bid, roomId, ssn, hotelid, fullname], (err, res) => {
                // tslint:disable-next-line:no-console
                console.log(err, res);
                resolve({fullname: fullname, hotelid: hotelid, roomid: roomId, bid: bid})
            });
        });
    }

    public addRental(bid: string) {
        const queryString = "INSERT INTO Rental (bid)" +
            "VALUES($1)";
        this.client.query(queryString,[bid],(err, res) => {
            // tslint:disable-next-line:no-console
            console.log(err, res);
        });
    }

    public getAllHotelChainsForDashboard(uid: string){
        const queryString = "SELECT * FROM HotelChains WHERE uid = $1";
        return new Promise(resolve => {
            this.client.query(queryString, [uid], (err, res) => {
                resolve(res);
            })
        })
    }

    public getHotelsForDashboard(uid: string) : Promise<any> {
        const queryString = "SELECT * FROM Hotel WHERE CHAINID IN (SELECT CHAINID From HotelChains WHERE uid = $1)";
        return new Promise((resolve) => {
            this.client.query(queryString, [uid], (err, res) => {
                console.log(err, res);
                resolve(res);
            });
        })
    }

    public getAllHotels() : Promise<any> {
        const queryString = "SELECT * FROM Hotel WHERE numrooms > $1";
        return new Promise<any>(resolve => {
            this.client.query(queryString, [0], (err, res) => {
                resolve(res.rows);
            });
        });
    }

    public getEmployee(email: string) : Promise<any>{
        const queryString = "SELECT * FROM Employee WHERE email = $1";

        return new Promise((resolve) => {
            this.client.query(queryString, [email],(err, res) => {
                resolve(res);
            })
        });
    }

    public async isEmployee(email: string){
        const queryString = "SELECT * FROM Employee WHERE email = $1";
        return new Promise(resolve => {
            this.client.query(queryString, [email],(err, res) => {
                resolve (res.rows.length > 0);
            });
        });
    }

    public getUser(email: string) : Promise<any>{
        const queryString = "SELECT * FROM Customer WHERE email = $1";

        return new Promise(resolve => {
            this.isEmployee(email).then(result => {
                if (result === true){
                    this.getEmployee(email).then((res) => {
                        const result = {...res.rows[0], userType: "EMPLOYEE"};
                        resolve(result)
                    });
                } else {
                    this.client.query(queryString, [email],(err, res: any) => {
                        const result = {...res.rows[0], userType: "REGULAR"};
                        resolve(result)
                    });
                }
            });
        });
    }

    public getRoomsForDashboard(uid: string) : Promise<any> {
        // Complex Query
        const queryString = "SELECT * FROM Room WHERE hotelid IN (SELECT hotelid FROM Hotel WHERE chainid IN " +
            "(SELECT chainid from HotelChains WHERE uid = $1))";
        return new Promise((resolve) => {
            this.client.query(queryString, [uid],(err, res) => {
               resolve(res);
            });
        })
    }

    public getAllRooms() : Promise<any> {
        const queryString = "SELECT * FROM Room";

        return new Promise((resolve) => {
            this.client.query(queryString,(err, res) => {
                resolve(res);
            });
        });
    }

    public getAvailableRooms(hotelid: string) : Promise<any> {

        return new Promise(resolve => {
            const queryString = "SELECT * FROM Room WHERE booked = $1 AND hotelid = $2";
            this.client.query(queryString, [false, hotelid],(err, res: any) => {
                resolve(res.rows)
            });
        })
    }

    public getUsers() : Promise<any> {
        const queryString = "SELECT * FROM Customer";

        return new Promise((resolve) => {
            this.client.query(queryString, (err, res) => {
                resolve(res);
            });
        });
    }

    public getBookings(uid: string) : Promise<any> {
        const queryString = "SELECT * FROM Booking WHERE hotelid IN (SELECT hotelid FROM Room WHERE hotelid IN (SELECT hotelid FROM Hotel WHERE chainid IN " +
        "(SELECT chainid from HotelChains WHERE uid = $1)))";

        return new Promise((resolve) => {
            this.client.query(queryString, [uid],(err, res) => {
                resolve(res);
            });
        });
    }

    public getEmployees() : Promise<any> {
        const queryString = "SELECT * FROM Employee";

        return new Promise((resolve) => {
            this.client.query(queryString, (err, res) => {
                resolve(res);
            });
        });
    }

    public getRental() : Promise<any> {
        const queryString = "SELECT * FROM Rental";

        return new Promise((resolve) => {
            this.client.query(queryString, (err, res) => {
                resolve(res);
            });
        });
    }


}
