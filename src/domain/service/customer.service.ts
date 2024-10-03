import CustomerModel from "../../infrastructure/db/sequelize/model/customer.model"
import CustomerRepository from "../../infrastructure/repository/customer.repository"
import Customer from "../entity/customer"
import Address from "../entity/value_object/address"
import AddressUpdateEvent from "../event/customer/address-update.event";
import CustomerCreatedEvent from "../event/customer/customer-created.event";
import EnviaConsoleLog1Handler from "../event/customer/handler/consolelog1-when-customer-is-created.handler";
import EnviaConsoleLog2Handler from "../event/customer/handler/consolelog2-when-customer-is-created.handler";
import EnviaConsoleLogHandler from "../event/customer/handler/update-address.handler";
import EventDispatcher from "../event/shared/event-dispatcher";


export default class CustomerService{
    static async createCustomer(customer: Customer){
        const customerRepository = new CustomerRepository();
        await customerRepository.create(customer);

        const eventDispatcher = new EventDispatcher();
        eventDispatcher.register("CustomerCreatedEvent", new EnviaConsoleLog1Handler());
        eventDispatcher.register("CustomerCreatedEvent", new EnviaConsoleLog2Handler());
        eventDispatcher.notify(new CustomerCreatedEvent(customer));
    }

    static async updateCustomerAddress(customer: Customer, address: Address){
        customer.changeAddress(address);

        const customerRepository = new CustomerRepository();
        await customerRepository.update(customer);

        const eventDispatcher = new EventDispatcher();
        eventDispatcher.register("AddressUpdateEvent", new EnviaConsoleLogHandler());
        eventDispatcher.notify(new AddressUpdateEvent(customer.id, customer.name, customer.address));
    }
}