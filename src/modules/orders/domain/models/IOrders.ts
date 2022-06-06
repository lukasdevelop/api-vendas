import { ICustomer } from "@modules/customers/domain/models/ICustomer"
import { ICreateOrderProductsDTO } from "./ICreateOrderProductsDTO.dto"

export interface IOrder {

  id: string
  order: number
  customer: ICustomer
  order_products: ICreateOrderProductsDTO[]
  created_at: Date
  updated_at: Date
  
}