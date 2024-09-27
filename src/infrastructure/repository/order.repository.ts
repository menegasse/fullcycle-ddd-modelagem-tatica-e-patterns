import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository-interface";
import OrderItemModel from "../db/sequelize/model/order-item.models";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface{
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                product_id: item.productId,
            })),
        },
        {
            include: [{model: OrderItemModel}],
        });
    }

    async find(id: string): Promise<Order> {
        let orderModel;

        try{
            orderModel = await OrderModel.findOne({
                where: {id}, 
                include: ["items"]
            });
        }catch(error){
            throw new Error("Order not found!");
        }

        return new Order(
            orderModel.id,
            orderModel.customer_id,
            orderModel.items.map(item => new OrderItem(
                item.id, 
                item.name, 
                item.unitPrice,
                item.product_id,
                item.quantity
            )),
        );
    }

    async findAll(customer: Customer): Promise<Order[]> {
        let orderModel;

        try{
            orderModel = await OrderModel.findAll({
                where: {customer_id: customer.id}, 
                include: ["items"]
            });
        }catch(error){
            throw new Error(`${customer.name} hasn't created any orders yet!`);
            
        }        

        return orderModel.map((order) => {
            return new Order(
                order.id,
                order.customer_id,
                order.items.map(item => new OrderItem(
                    item.id, 
                    item.name, 
                    item.unitPrice,
                    item.product_id,
                    item.quantity
                )),
            );
        });
    }
}