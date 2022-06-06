import AppError from "@shared/errors/AppError"
import { compare } from "bcryptjs"
import authConfig from '@config/auth'
import { sign } from "jsonwebtoken"
import { getCustomRepository } from "typeorm"
import User from "../infra/typeorm/entities/User"
import UsersRepository from "../infra/typeorm/repositories/UsersRepository"

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}



class CreateSessionsService {

  public async execute({email, password} : IRequest): Promise<IResponse>{
    const usersRepository = getCustomRepository(UsersRepository)
    const user = await usersRepository.findByEmail(email)

    if(!user){
      throw new AppError('Incorret email/password combination.', 401)
    }

    const passwordConfirmed = await compare(password, user.password)

    if(!passwordConfirmed){
      throw new AppError('Incorret email/password combination.', 401)
    }

    const token  = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    })

    return {
      user,
      token
    }
  }
}

export default CreateSessionsService
