import redisCache from "@shared/cache/RedisCache"
import AppError from "@shared/errors/AppError"
import { inject, injectable } from "tsyringe"
import { ICreateProductDTO } from "../domain/models/ICreateProductDTO.dto"
import { IProduct } from "../domain/models/IProduct"
import { IProductsRepository } from "../domain/repositories/IProductsRepository"
@injectable()
class CreateProductService {

  constructor(
    @inject('UsersRepository')
    private productsRepository: IProductsRepository
  ){}

  public async execute({name, price, quantity} : ICreateProductDTO): Promise<IProduct>{

    const productExists = await this.productsRepository.findByName(name)

    if(productExists){
      throw new AppError('There is already one product with this name')
    }

    //const redisCache = new RedisCache()
    await redisCache.invalidate('api-vendas-PRODUCT_LIST')

    const product = this.productsRepository.create({
      name,
      price,
      quantity
    })


    return product
  }
}

export default CreateProductService
