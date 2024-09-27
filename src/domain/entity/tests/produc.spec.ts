import Product from "../product";

describe("Product uinit tests", () => {

    it("should throw error when id is empty", () =>{
        expect(() => {
            let order = new Product("", "Product 1", 100);
        }).toThrow("ID is required!");
    });

    it("should throw error when name is empty", () =>{
        expect(() => {
            let order = new Product("123", "", 100);
        }).toThrow("Name is required!");
    });

    it("should throw error when price is less than zero", () =>{
        expect(() => {
            let order = new Product("123", "Product 1", -1);
        }).toThrow("Price must be greater than zero!");
    });

    it("should change name", () =>{
        let customer = new Product("123", "Product 1", 100);
        customer.changeName("Product X");

        expect(customer.name).toBe("Product X");
    });

    it("should change price", () =>{
        let customer = new Product("123", "Product 1", 100);
        customer.changePrice(125);

        expect(customer.price).toBe(125);
    });

});