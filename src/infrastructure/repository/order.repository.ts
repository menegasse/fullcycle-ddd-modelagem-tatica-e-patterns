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

    async update(entity: Order): Promise<void> {
        const orderModel = await this.find(entity.id);

        let itemsIds = entity.items.map(item => item.id);
        const itemsToExclude = orderModel.items.filter(item => !itemsIds.includes(item.id));
        if (itemsToExclude.length !== 0){
            await OrderItemModel.destroy({
                where:{id: itemsToExclude.map(item => item.id)}
            });
        }
        
        itemsIds = orderModel.items.map(item => item.id);
        const itemsToAdd = entity.items.filter(item => !itemsIds.includes(item.id));
        if (itemsToAdd.length !== 0){
            await OrderItemModel.bulkCreate(itemsToAdd.map((item) => ({
                id: item.id,
                name: item.name,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                product_id: item.productId,
                order_id: entity.id
            })));
        }
        
    }

    async findAll(): Promise<Order[]> {
        const orderModel = await OrderModel.findAll({include: ["items"]});

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