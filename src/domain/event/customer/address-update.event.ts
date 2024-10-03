import Address from "../../entity/value_object/address";
import EventInterface from "../shared/event.interface";

export default class AddressUpdateEvent implements EventInterface{
    dataTimeOccured: Date;
    eventData: any;

    constructor(customerId: string, customerName:string, address: Address){
        this.dataTimeOccured = new Date();
        this.eventData = {
            customerId,
            customerName,
            address
        };
    }
}