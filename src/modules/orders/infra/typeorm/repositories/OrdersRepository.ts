import { Repository} from 'typeorm'
import Order from '../entities/Order'
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository'
import { ICreateOrder } from '@modules/orders/domain/models/ICreateOrder'
import { IOrderPaginate } from '@modules/orders/domain/models/IOrderPaginate'




export default class OrdersRepository  implements IOrdersRepository{

  constructor(private ormRepository: Repository<Order>){}

  public async findAllPaginate(): Promise<IOrderPaginate> {
    
    const orders = await this.ormRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.customer', 'customer')
      .leftJoinAndSelect('orders.orders_products', 'order_products')
      .paginate()

      return orders as IOrderPaginate
  }
 

  public async findById(id: string): Promise<Order | undefined>{
    const order = this.ormRepository.findOne(id, {
      relations: ['order_products', 'customer']
    })

    return order
  }

  public async create({customer, products}: ICreateOrder): Promise<Order>{
    const order = this.ormRepository.create({
      customer,
      order_products: products
    })

    await this.ormRepository.save(order)

    return order
  }

}
