import { ICreateProductDTO } from '@modules/products/domain/models/ICreateProductDTO.dto'
import { IFindProducts } from '@modules/products/domain/models/IFindProducts'
import { IProduct } from '@modules/products/domain/models/IProduct'
import { IProductPaginate } from '@modules/products/domain/models/IProductPaginate'
import { IUpdateStockProductDTO } from '@modules/products/domain/models/IUpdateStockProductDTO.dto'
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository'
import { getRepository, In, Repository} from 'typeorm'
import Product from '../entities/Product'


export default class ProductsRepository implements IProductsRepository{

  constructor(private ormRepository: Repository<Product>){
    this.ormRepository = getRepository(Product)
  }

  public async save(product: Product): Promise<Product>{
    await this.ormRepository.save(product)

    return product
  }

  public async remove(product: Product): Promise<void>{
    await this.ormRepository.remove(product)
  }

  public async updateStock(products: IUpdateStockProductDTO[]): Promise<void>{
    await this.ormRepository.save(products)
  }

  public async create({name, price, quantity}: ICreateProductDTO): Promise<Product>{
    const product = this.ormRepository.create({ name, price, quantity })

    await this.ormRepository.save(product)

    return product
  }

  public async findByName(name: string): Promise<Product | undefined>{
    const product = this.ormRepository.findOne({
      where: { name }
    })

    return product
  }

  public async findById(id: string): Promise<IProduct | undefined> {
    const product = await this.ormRepository.findOne(id)

    return product
  }

  public async findAllByIds(products: IFindProducts[]): Promise<Product[]>{
    const productIds = products.map(product => product.id)

    const existsProduts = await this.ormRepository.find({
      where: {
        id: In(productIds)
      }
    })

    return existsProduts
  }

  public async findAll(): Promise<IProduct[]> {
    const products = await this.ormRepository.find()

    return products
  }

  public async findAllPaginate(): Promise<IProductPaginate> {
    const products = await this.ormRepository.createQueryBuilder().paginate()


    return products as IProductPaginate
  }

  

}
