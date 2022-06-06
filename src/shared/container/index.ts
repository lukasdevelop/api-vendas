import { container } from 'tsyringe'

import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository'

import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository'
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository'
import { OrdersRepository } from '@modules/orders/infra/typeorm/repositories/OrdersRepository'

import { ProductsRepository } from '@modules/products/infra/typeorm/repositories/ProductsRepository'
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository'


container.registerSingleton<ICustomersRepository>('CustomersRepository', CustomersRepository)

container.registerSingleton<IProductsRepository>('ProductsRepository', ProductsRepository)

container.registerSingleton<IOrdersRepository>('OrdersRepository', OrdersRepository)