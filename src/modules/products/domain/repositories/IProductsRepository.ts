import { ICreateProductDTO } from "../models/ICreateProductDTO.dto";
import { IFindProducts } from "../models/IFindProducts";
import { IProduct } from "../models/IProduct";
import { IProductPaginate } from "../models/IProductPaginate";
import { IUpdateStockProductDTO } from "../models/IUpdateStockProductDTO.dto";

export interface IProductsRepository {
  findByName(name: string): Promise<IProduct | undefined>
  findById(id: string): Promise<IProduct | undefined>
  findAll(): Promise<IProduct[]>
  findAllPaginate(): Promise<IProductPaginate>
  findAllByIds(products: IFindProducts[]): Promise<IProduct[]>
  create(data: ICreateProductDTO): Promise<IProduct>
  save(product: IProduct): Promise<IProduct>
  updateStock(products: IUpdateStockProductDTO[]): Promise<void>
  remove(product: IProduct): Promise<void>
}