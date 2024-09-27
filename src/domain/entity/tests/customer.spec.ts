import Customer from "../customer";
import Address from "../value_object/address";

describe("Customer uinit tests", () => {

    it("should throw error when id is empty", () =>{

        expect(() => {
            let customer = new Customer("", "Jhon")
        }).toThrow("ID is required!")
    });

    it("should throw error when name is empty", () =>{

        expect(() => {
            let customer = new Customer("123", "")
        }).toThrow("Name is required!")
    });

    it("should change name", () =>{
        let customer = new Customer("123", "Jhon")
        customer.changeName("Jane")

        expect(customer.name).toBe("Jane")
    });

    it("should activate customer", () => {
        let customer = new Customer("1", "Customer 1")
        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.address = address

        customer.activate();

        expect(customer.isActive()).toBe(true);
    });

    it("should deactivate customer", () => {
        let customer = new Customer("1", "Customer 1")

        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    });

    it("should throw error when address is undefined when you activate a customer", () => {
        expect(() =>{
            let customer = new Customer("1", "Customer 1");

            customer.activate();
        }).toThrow("Address is mandatory to activate a customer!");
    });

    it("should add reward points", () => {
        const customer = new Customer("1", "Costumer 1");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(5);
        expect(customer.rewardPoints).toBe(15);
    });
})