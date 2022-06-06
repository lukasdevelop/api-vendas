import AppError from "@shared/errors/AppError"
import { inject, injectable } from "tsyringe"
import { ICreateCustomerDTO } from "../domain/models/ICreateCustomer.dto"
import { ICustomer } from "../domain/models/ICustomer"
import { ICustomersRepository } from "../domain/repositories/ICustomersRepository"

@injectable()
export default class CreateCustomerService {

  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository
  ){}

  public async execute({name, email} : ICreateCustomerDTO): Promise<ICustomer>{

    const emailExists = await this.customersRepository.findByEmail(email)

    if(emailExists){
      throw new AppError('Email address already used.')
    }

    const customer = this.customersRepository.create({
      name,
      email,
    })

    return customer
  }
}