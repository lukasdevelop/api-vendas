import { IProduct } from '@modules/products/domain/models/IProduct'

export interface ICreateOrderDTO {
  customer_id: string
  products: IProduct[]
}
