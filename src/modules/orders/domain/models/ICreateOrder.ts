import { ICustomer } from "@modules/customers/domain/models/ICustomer";
import { ICreateOrderProductsDTO } from "./ICreateOrderProductsDTO.dto";

export interface ICreateOrder {
  customer: ICustomer
  products: ICreateOrderProductsDTO[]
  
}