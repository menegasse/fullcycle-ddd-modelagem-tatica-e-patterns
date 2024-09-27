import Customer from "../entity/customer";
import Order from "../entity/order";
import {FindRepositoryInterface} from "./repository-interface";

export default interface OrderRepositoryInterface 
    extends FindRepositoryInterface<Order>{
        findAll(customer: Customer): Promise<Order[]>;
    }