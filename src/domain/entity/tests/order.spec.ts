import Order from "../order";
import OrderItem from "../order_item";

describe("Order uinit tests", () => {

    it("should throw error when id is empty", () =>{
        expect(() => {
            let order = new Order("", "123", [])
        }).toThrow("ID is required!")
    });

    it("should throw error when customerId is empty", () =>{
        expect(() => {
            let order = new Order("123", "", [])
        }).toThrow("CustomerID is required!")
    });

    it("should throw error when item is empty", () =>{
        expect(() => {
            let order = new Order("123", "123", [])
        }).toThrow("Items are required!")
    });

    it("should caculate total", () =>{
        const item1 = new OrderItem("1", "Item 1", 100, "p1", 2);
        const item2 = new OrderItem("2", "Item 2", 200, "p2", 2);

        const order1 = new Order("1", "1", [item1]);
        expect(order1.total()).toBe(200);

        const order2 = new Order("2", "1", [item1, item2]);
        expect(order2.total()).toBe(600);
    });

    it("should throw error if the item quantity is less or equal zero", () =>{
        expect(() => {
            const item = new OrderItem("1", "Item 1", 100, "1", -1);

            let order = new Order("123", "123", [item])
        }).toThrow("Quantity must be greater than zero!")
    });
});