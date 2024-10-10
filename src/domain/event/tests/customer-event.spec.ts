import Customer from "../../entity/customer";
import Address from "../../entity/value_object/address";
import AddressUpdateEvent from "../customer/address-update.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import EnviaConsoleLog1Handler from "../customer/handler/consolelog1-when-customer-is-created.handler";
import EnviaConsoleLog2Handler from "../customer/handler/consolelog2-when-customer-is-created.handler";
import EnviaConsoleLogHandler from "../customer/handler/update-address.handler";
import EventDispatcher from "../shared/event-dispatcher";

describe("Customer events tests", () =>{
    afterEach(async () => {
        jest.restoreAllMocks();
    });

    it("should create, register and notify CustomerCreatedEvent event", ()=>{
        const eventDispatcher = new EventDispatcher();

        const handler1 = new EnviaConsoleLog1Handler();
        const spyHandler1 = jest.spyOn(handler1, "handler");

        const handler2 = new EnviaConsoleLog2Handler();
        const spyHandler2 = jest.spyOn(handler2, "handler");

        eventDispatcher.register('CustomerCreatedEvent', handler1);
        eventDispatcher.register('CustomerCreatedEvent', handler2);

        const customer = new Customer("1", "Client 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        eventDispatcher.notify(new CustomerCreatedEvent(customer));
        
        expect(spyHandler1).toHaveBeenCalled();
        expect(spyHandler2).toHaveBeenCalled();
    });

    it("should create, register and notify AddressUpdateEvent event", ()=>{
        const eventDispatcher = new EventDispatcher();

        const handler = new EnviaConsoleLogHandler();
        const spyHandler = jest.spyOn(handler, "handler");

        eventDispatcher.register('AddressUpdateEvent', handler);

        const customer = new Customer("1", "Client 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        eventDispatcher.notify(new AddressUpdateEvent(customer, address));
        
        expect(spyHandler).toHaveBeenCalled();
    });
});