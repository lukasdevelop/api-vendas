import { ICreateOrder } from "../models/ICreateOrder";
import { IOrderPaginate } from "../models/IOrderPaginate";
import { IOrder } from "../models/IOrders";

export interface IOrdersRepository {
  findById(id: string): Promise<IOrder | undefined>
  findAllPaginate(): Promise<IOrderPaginate>
  create(data: ICreateOrder): Promise<IOrder>
}