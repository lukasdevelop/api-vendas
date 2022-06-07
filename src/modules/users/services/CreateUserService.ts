import AppError from "@shared/errors/AppError"
import { inject, injectable } from "tsyringe"
import { ICreateUserDTO } from "../domain/models/ICreateUserDTO.dto"
import { IUser } from "../domain/models/IUser"
import { IUsersRepository } from "../domain/repositories/IUsersRepository"
import { IHashProvider } from "../providers/HashProvider/models/IHashProvider"

@injectable()
export default class CreateUserService {
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
