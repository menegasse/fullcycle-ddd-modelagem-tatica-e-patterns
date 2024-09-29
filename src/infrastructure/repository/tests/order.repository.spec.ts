import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../db/sequelize/model/customer.model";
import OrderModel from "../../db/sequelize/model/order.model";
import OrderItemModel from "../../db/sequelize/model/order-item.models";
import ProductModel from "../../db/sequelize/model/product.model";
import CustomerRepository from "../customer.repository";
import Customer from "../../../domain/entity/customer";
import Address from "../../../domain/entity/value_object/address";
import ProductRepository from "../product.repository";
import Product from "../../../domain/entity/product";
import OrderItem from "../../../domain/entity/order_item";
import Order from "../../../domain/entity/order";
import OrderRepository from "../order.repository";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect:"sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        });

        sequelize.addModels([CustomerModel, ProductModel, OrderItemModel, OrderModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        customer.address = new Address("Street 1", 1, "Zipecode 1", "City 1");
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const orderRepository = new OrderRepository();
        const order = new Order("1", customer.id, [orderItem]);
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where:{id: order.id},
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "1",
            customer_id: "123",
            items:[
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    unitPrice: orderItem.unitPrice,
                    quantity: orderItem.quantity,
                    order_id: "1",
                    product_id: "123",
                }
            ]
        });
    });

    it("should update a order", async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        customer.address = new Address("Street 1", 1, "Zipecode 1", "City 1");
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product1 = new Product("1", "Product 1", 10);
        const product2 = new Product("2", "Product 2", 20);
        const product3 = new Product("3", "Product 3", 30);
        await productRepository.create(product1);
        await productRepository.create(product2);
        await productRepository.create(product3);

        const orderItem1 = new OrderItem("1", product1.name, product1.price, product1.id, 2);
        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 1);
        const orderItem3 = new OrderItem("3", product3.name, product3.price, product3.id, 1);

        const orderRepository = new OrderRepository();
        const order = new Order("1", customer.id, [orderItem1, orderItem2]);
        await orderRepository.create(order);

        order.removeItem(orderItem2.id);
        order.addItem(orderItem3);        
        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({
            where:{id: order.id},
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "1",
            customer_id: "123",
            items: [
                {
                    id: orderItem1.id,
                    name: orderItem1.name,
                    unitPrice: orderItem1.unitPrice,
                    product_id: orderItem1.productId,
                    quantity: orderItem1.quantity,
                    order_id: "1",
                },
                {
                    id: orderItem3.id,
                    name: orderItem3.name,
                    unitPrice: orderItem3.unitPrice,
                    product_id: orderItem3.productId,
                    quantity: orderItem3.quantity,
                    order_id: "1",
                }
            ]        
        });

    });

    it("should throw an error when order is not found", async() => {
        const orderRepository = new OrderRepository();

        expect(async () => {
            await orderRepository.find("456ABC");
        }).rejects.toThrow("Order not found!");
    });

    
    it("should find an order", async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        customer.address = new Address("Street 1", 1, "Zipecode 1", "City 1");
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const orderRepository = new OrderRepository();
        const order = new Order("123", customer.id, [orderItem]);            
        await orderRepository.create(order);
        
        const orderModel = await OrderModel.findOne({
            where:{id: "123"},
            include: ["items"],
        });

        const foundOrder = await orderRepository.find("123");
        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: customer.id,
            items: foundOrder.items.map((item) => ({
                id: item.id,
                name: item.name,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                product_id: item.productId,
                order_id: "123",
            })),
        });
    });

    it("should find all orders", async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        customer.address = new Address("Street 1", 1, "Zipecode 1", "City 1");
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product1 = new Product("1", "Product 1", 10);
        const product2 = new Product("2", "Product 2", 20);
        await productRepository.create(product1);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem("1", product1.name, product1.price, product1.id, 2);
        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 1);
        const orderItem3 = new OrderItem("3", product1.name, product1.price, product1.id, 1);

        const orderRepository = new OrderRepository();
        const order1 = new Order("1", customer.id, [orderItem1]);            
        const order2 = new Order("2", customer.id, [orderItem2, orderItem3]);
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders).toHaveLength(2);
        expect(orders).toContainEqual(order1);
        expect(orders).toContainEqual(order2);
    });
});