import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/db/sequelize/model/customer.model";
import CustomerRepository from "../../../infrastructure/repository/customer.repository";
import Customer from "../../entity/customer";
import Address from "../../entity/value_object/address";
import CustomerService from "../customer.service";
import EventDispatcher from "../../event/shared/event-dispatcher";

jest.mock("../../event/shared/event-dispatcher");

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
    });

    afterEach(async () => {
        await sequelize.close();

        jest.restoreAllMocks();
    });

    it("should create a customer in the database when service called", async () => {
        const customer = new Customer("1", "Client 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);

        CustomerService.createCustomer(customer);

        const customerRepository = new CustomerRepository();
        const customerFound = await customerRepository.find(customer.id);
        expect(customerFound).toStrictEqual(customer);
    });

    it("should register and notify CustomerCreateEvent when service called", async () => { 
        jest.setSystemTime(new Date(2024, 10, 3, 12));

        const mockRegister = jest.fn();
        const mockNotify = jest.fn();
        (EventDispatcher as jest.Mock).mockImplementation(() => ({
            register: mockRegister,
            notify: mockNotify,
        }));

        const customer = new Customer("1", "Client 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);

        await CustomerService.createCustomer(customer);
        expect(mockRegister).toHaveBeenCalled();
        expect(mockNotify).toHaveBeenCalled();
    });

    it("should update a customer address in the database", async () => {
        const customer = new Customer("1", "Client 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        
        const customerRepository = new CustomerRepository();
        await customerRepository.create(customer);

        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        CustomerService.updateCustomerAddress(customer, address2);

        const customerFound = await customerRepository.find(customer.id);
        expect(customerFound).toStrictEqual(customer);
    });

    it("should register and notify AddressUpdateEvent when service called", async () => {
        jest.setSystemTime(new Date(2024, 10, 3, 12));

        const mockRegister = jest.fn();
        const mockNotify = jest.fn();
        (EventDispatcher as jest.Mock).mockImplementation(() => ({
            register: mockRegister,
            notify: mockNotify,
        }));

        const customer = new Customer("1", "Client 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        
        const customerRepository = new CustomerRepository();
        await customerRepository.create(customer);

        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        await CustomerService.updateCustomerAddress(customer, address2);
        expect(mockRegister).toHaveBeenCalled();
        expect(mockNotify).toHaveBeenCalled();
    });
});