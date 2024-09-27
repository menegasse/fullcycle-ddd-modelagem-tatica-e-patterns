import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/value_object/address";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository-interface";
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface{
    async create(entity: Customer): Promise<void> {
        const address: Address = entity.address

        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            rewardPoints: entity.rewardPoints,
            active: entity.isActive(),
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
        });
    }

    async update(entity: Customer): Promise<void> {
        const address: Address = entity.address

        await CustomerModel.update(
            {
                name: entity.name,
                rewardPoints: entity.rewardPoints,
                active: entity.isActive(),
                street: address.street,
                number: address.number,
                zipcode: address.zip,
                city: address.city,
            },
            {
                where:{
                    id: entity.id
                }
            }
        );
    }

    async find(id: string): Promise<Customer> {
        let customerModel;

        try{
            customerModel = await CustomerModel.findOne({where: {id}});
        }catch(error){
            throw new Error("Customer not found!");
        }
        
        const customer = new Customer(customerModel.id, customerModel.name);
        customer.addRewardPoints(customerModel.rewardPoints);
        customer.address = new Address(
            customerModel.street,
            customerModel.number,
            customerModel.zipcode,
            customerModel.city
        );

        if (customerModel.active){
            customer.activate()
        }

        return customer;
    }

    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();

        return customerModels.map((customerModel) => {
                const customer = new Customer(customerModel.id, customerModel.name);
                customer.addRewardPoints(customerModel.rewardPoints);
                customer.address = new Address(
                    customerModel.street,
                    customerModel.number,
                    customerModel.zipcode,
                    customerModel.city
                );
                
                if (customerModel.active){
                    customer.activate()
                }
                
                return customer;
            }
        );
    }
}