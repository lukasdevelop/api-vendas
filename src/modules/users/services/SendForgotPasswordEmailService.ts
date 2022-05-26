import AppError from "@shared/errors/AppError"

import { getCustomRepository } from "typeorm"
import UsersRepository from "../typeorm/repositories/UsersRepository"
import UsersTokensRepository from "../typeorm/repositories/UsersTokensRepository"

interface IRequest {
  email: string
}

export default class SendForgotPasswordEmailService {

  public async execute({email} : IRequest): Promise<void>{
    const usersRepository = getCustomRepository(UsersRepository)
    const usersTokensRepository = getCustomRepository(UsersTokensRepository)

    const user = await usersRepository.findByEmail(email)

    if(!user){
      throw new AppError('User does not exists.')
    }

    const token = await usersTokensRepository.generate(user.id)

    console.log(token)
  }
}