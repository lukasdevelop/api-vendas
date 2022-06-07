import AppError from "@shared/errors/AppError"
import {isAfter, addHours} from 'date-fns'
import { hash } from 'bcryptjs'
import { getCustomRepository } from "typeorm"
import UsersRepository from "../infra/typeorm/repositories/UsersRepository"
import UsersTokensRepository from "../infra/typeorm/repositories/UserTokensRepository"
import { inject, injectable } from "tsyringe"
import { IUsersRepository } from "../domain/repositories/IUsersRepository"
import { IUserTokensRepository } from "../domain/repositories/IUserTokensRepository"
import { IResetPassword } from "../domain/models/IResetPassword"

interface IRequest {
  token: string
  password: string
}
@injectable()
export default class ResetPasswordService {

  constructor(
    @inject('UsersRepository') private usersRepo: IUsersRepository,
    @inject('UserTokensRepository') private userTokensRepo: IUserTokensRepository
    ){}

  public async execute({token, password} : IResetPassword): Promise<void>{
    

    const userToken = await this.userTokensRepo.findByToken(token)

    if(!userToken){
      throw new AppError('User Token does not exists.')
    }

    const user = await this.usersRepo.findById(userToken.user_id)

    if(!user) {
      throw new AppError('User does not exists.')
    }

    const tokenCreatedAt = userToken.created_at
    const compareDate = addHours(tokenCreatedAt, 2)

    if(isAfter(Date.now(), compareDate)){
      throw new AppError('Token expired.')
    }

    user.password = await hash(password, 8)

    await this.usersRepo.save(user)

  }
}