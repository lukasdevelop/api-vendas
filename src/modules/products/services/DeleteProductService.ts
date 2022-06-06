import redisCache from "@shared/cache/RedisCache"
import AppError from "@shared/errors/AppError"
import { inject, injectable } from "tsyringe"
import { IDeleteProduct } from "../domain/models/IDeleteProductDTO.dto"
import { IProductsRepository } from "../domain/repositories/IProductsRepository"

@injectable()
export default class DeleteProductService {

  constructor(@inject('ProductRepository') private productsRepo: IProductsRepository){}

  public async execute({id} : IDeleteProduct ): Promise<void> {

    const product = await this.productsRepo.findById(id)

    if(!product){
      throw new AppError('Product not found.')
    }

    //const redisCache = new RedisCache()

    await redisCache.invalidate('api-vendas-PRODUCT_LIST')

    await this.productsRepo.remove(product)
  }
}