import Customer from "../../entity/customer";
import Address from "../../entity/value_object/address";
import EventInterface from "../shared/event.interface";

export default class AddressUpdateEvent implements EventInterface{
    dataTimeOccured: Date;
    eventData: any;

    constructor(customer: Customer, address: Address){
        this.dataTimeOccured = new Date();

        const {id, name} = customer;
        this.eventData = {
            id,
            name,
            address
        };
    }
}