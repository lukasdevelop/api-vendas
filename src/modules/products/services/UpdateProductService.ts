import redisCache from "@shared/cache/RedisCache";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IProduct } from "../domain/models/IProduct";
import { IUpdateProductDTO } from "../domain/models/IUpdateProductDTO.dto";
import { IProductsRepository } from "../domain/repositories/IProductsRepository";


@injectable()
export default class UpdateProductService {

  constructor(@inject('ProducstRepository') private productsRepo: IProductsRepository){}

  public async execute({id, name, price, quantity} : IUpdateProductDTO): Promise<IProduct> {
   

    const product = await this.productsRepo.findById(id)

    if(!product) {
      throw new AppError('Product not found.')
    }

    const productExists = await this.productsRepo.findByName(name)

    if(productExists && name != product.name) {
      throw new AppError('There is already one product with this name.')
    }

    //const redisCache = new RedisCache()

    await redisCache.invalidate('api-vendas-PRODUCT_LIST')

    product.name = name
    product.price = price
    product.quantity = quantity

    await this.productsRepo.save(product)

    return product
  }
}
