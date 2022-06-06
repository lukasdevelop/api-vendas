import { ICreateCustomerDTO } from "../models/ICreateCustomer.dto";
import { ICustomer } from "../models/ICustomer";

export interface ICustomersRepository {
  findByName(name: string): Promise<ICustomer | undefined>

  findById(id: string): Promise<ICustomer | undefined>

  findByEmail(email: string): Promise<ICustomer | undefined>

 create(data: ICreateCustomerDTO): Promise<ICustomer>

 save(customer: ICustomer): Promise<ICustomer>
}