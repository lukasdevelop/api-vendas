import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import Customer from "../infra/typeorm/entities/Customer";
import CustomersRepository from "../infra/typeorm/repositories/CustomersRepository";

interface IRequest {
  id: string

}

export default class ShowCustomerService {

  public async execute({id}: IRequest): Promise<Customer>{
    const customerRepository = getCustomRepository(CustomersRepository)

    const customer = await customerRepository.findById(id)

    if(!customer){
      throw new AppError('Customer not found.')
    }

    return customer
  }
}