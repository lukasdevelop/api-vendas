import AppError from "@shared/errors/AppError"
import { hash } from "bcryptjs"
import { inject, injectable } from "tsyringe"
import { getCustomRepository } from "typeorm"
import { ICreateUserDTO } from "../domain/models/ICreateUserDTO.dto"
import { IUser } from "../domain/models/IUser"
import { IUsersRepository } from "../domain/repositories/IUsersRepository"
import User from "../infra/typeorm/entities/User"
import UsersRepository from "../infra/typeorm/repositories/UsersRepository"
import { IHashProvider } from "../providers/HashProvider/models/IHashProvider"

interface IRequest {
  name: string
  email: string
  password: string
}
@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepo: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ){}

  public async execute({name, email, password} : ICreateUserDTO): Promise<IUser>{
    
    const emailExists = await this.usersRepo.findByEmail(email)

    if(emailExists){
      throw new AppError('Email address already used.')
    }

    const hashedPassword = await this.hashProvider.generateHash(password)

    const user = this.usersRepo.create({
      name,
      email,
      password: hashedPassword
    })

    return user
  }
}

export default CreateUserService
