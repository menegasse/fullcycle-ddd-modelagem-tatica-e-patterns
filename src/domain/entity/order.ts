import OrderItem from "./order_item";

export default class Order {

    private _id: string;
    private _customerId: string;
    private _items: OrderItem[] = [];

    get id(): string{
        return this._id;
    }

    get customerId(): string{
        return this._customerId;
    }

    get items(): OrderItem[]{
        return this._items;
    }

    constructor(id: string, customerId: string, items: OrderItem[]){
        this._id = id;
        this._customerId = customerId;
        this._items = items;

        this.validate()
    }

    validate(){
        if(this._id.length === 0){
            throw new Error("ID is required!");
        }
        if(this._customerId.length === 0){
            throw new Error("CustomerID is required!");
        }
        if(this._items.length === 0){
            throw new Error("Items are required!");
        }
        
    }

    total(): number{
        return this._items.reduce((acc, item) => acc + item.price, 0);
    }

    removeItem(id: string){
        this._items = this._items.filter(item => item.id !== id);
    }

    addItem(item: OrderItem){
        const itemIndex = this._items.findIndex(
            _item => _item.productId == item.productId && _item.name == item.name
        );

        if(itemIndex !== -1){
            throw new Error("Item alredy exist!");
        }
        
        this._items.push(item)
    }
}