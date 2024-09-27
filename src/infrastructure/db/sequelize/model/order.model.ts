import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table} from "sequelize-typescript"
import CustomerModel from "./customer.model";
import OrderItemModel from "./order-item.models";

@Table({
    tableName:"orders",
    timestamps: false,
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @ForeignKey(() => CustomerModel)
    @Column({allowNull: false})
    declare customer_id: string;

    @BelongsTo(() => CustomerModel)
    declare customer: Awaited<CustomerModel>;

    @HasMany(() => OrderItemModel)
    declare items: OrderItemModel[];
}
