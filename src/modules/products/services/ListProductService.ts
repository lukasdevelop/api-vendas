import redisCache from '@shared/cache/RedisCache'
import { injectable, inject } from "tsyringe"
import { IProductsRepository } from "../domain/repositories/IProductsRepository"
import { IProductPaginate } from "../domain/models/IProductPaginate"
import { IProduct } from '../domain/models/IProduct'
@injectable()
class ListProductService {

  constructor(@inject('ProductRepository') private productsRepo: IProductsRepository){}

  public async execute(): Promise<IProductPaginate>{

    //const products = await this.productsRepo.findAllPaginate()

    let products = await redisCache.recover<IProductPaginate>(
      'api-vendas-PRODUCT_LIST'
    )

    if(!products){
      products = await this.productsRepo.findAllPaginate()

      await redisCache.save('api-vendas-PRODUCT_LIST', products)
    }

    return products
  }
}

export default ListProductService
