import { inject, injectable } from "tsyringe";
import { IOrderPaginate } from "../domain/models/IOrderPaginate";
import { IOrdersRepository } from "../domain/repositories/IOrdersRepository";

@injectable()
export default class ListOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository
  ){}
  
  public async execute(): Promise<IOrderPaginate> {
    const orders = await this.ordersRepository.findAllPaginate()

    return orders
  }
}