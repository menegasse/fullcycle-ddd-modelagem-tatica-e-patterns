import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/db/sequelize/model/customer.model";
import CustomerRepository from "../../../infrastructure/repository/customer.repository";
import Customer from "../../entity/customer";
import Address from "../../entity/value_object/address";
import EventDispatcher from "../../event/shared/event-dispatcher";
import CustomerService from "../customer.service";
import EnviaConsoleLog1Handler from "../../event/customer/handler/consolelog1-when-customer-is-created.handler";
import EnviaConsoleLog2Handler from "../../event/customer/handler/consolelog2-when-customer-is-created.handler";
import CustomerCreatedEvent from "../../event/customer/customer-created.event";
import EnviaConsoleLogHandler from "../../event/customer/handler/update-address.handler";
import AddressUpdateEvent from "../../event/customer/address-update.event";


describe("Customer service unit tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect:"sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        });

        sequelize.addModels([CustomerModel]);
        await sequelize.sync();

        //mock EventDispatcher
        jest.mock("../../event/shared/event-dispatcher");
    });

    afterEach(async () => {
        await sequelize.close();

        jest.restoreAllMocks();
    });

    it("should create a customer in the database and register CustomerCreatedEvent with 2 handlres", async () => {
        jest.setSystemTime(new Date(2024, 10, 3, 12));

        const customer = new Customer("1", "Client 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);

        const mockRegister = jest.fn(() => Promise.resolve());
        const mockNotify = jest.fn(() => Promise.resolve());
        EventDispatcher.prototype.register = mockRegister;
        EventDispatcher.prototype.notify = mockNotify;

        CustomerService.createCustomer(customer);

        const customerRepository = new CustomerRepository();
        const customerFound = await customerRepository.find(customer.id);
        expect(customerFound).toStrictEqual(customer);
        
        expect(mockRegister.mock.calls).toStrictEqual([
            [ 'CustomerCreatedEvent', new EnviaConsoleLog1Handler()],
            [ 'CustomerCreatedEvent', new EnviaConsoleLog2Handler()]
        ]);
        expect(mockNotify.mock.calls).toStrictEqual([
            [new CustomerCreatedEvent(customer)]
        ]);
    });

    it("should update a customer address in the database and register AddressUpdateEvent", async () => {
        jest.setSystemTime(new Date(2024, 10, 3, 12));

        const customer = new Customer("1", "Client 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        
        const customerRepository = new CustomerRepository();
        await customerRepository.create(customer);

        const mockRegister = jest.fn(() => Promise.resolve());
        const mockNotify = jest.fn(() => Promise.resolve());
        EventDispatcher.prototype.register = mockRegister;
        EventDispatcher.prototype.notify = mockNotify;

        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        CustomerService.updateCustomerAddress(customer, address2);

        const customerFound = await customerRepository.find(customer.id);
        expect(customerFound).toStrictEqual(customer);
        
        expect(mockRegister.mock.calls).toStrictEqual([
            [ 'AddressUpdateEvent', new EnviaConsoleLogHandler()],
        ]);
        expect(mockNotify.mock.calls).toStrictEqual([
            [new AddressUpdateEvent(customer.id, customer.name, address2)]
        ]);
    });
});