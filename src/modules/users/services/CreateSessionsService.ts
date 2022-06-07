import AppError from "@shared/errors/AppError"
import authConfig from '@config/auth'
import { Secret, sign } from "jsonwebtoken"
import { inject, injectable } from "tsyringe"
import { IUsersRepository } from "../domain/repositories/IUsersRepository"
import { IHashProvider } from "../providers/HashProvider/models/IHashProvider"
import { ICreateSession } from "../domain/models/ICreateSession"
import { IUserAuthenticated } from "../domain/models/IUserAuthenticated"




@injectable()
class CreateSessionsService {

  constructor(
    @inject('UsersRepository') private userRepo: IUsersRepository, 
    @inject('HashProvider') private hashProvider: IHashProvider,
    
    ){}

  public async execute({email, password} : ICreateSession): Promise<IUserAuthenticated>{

    const user = await this.userRepo.findByEmail(email)

    if(!user){
      throw new AppError('Incorret email/password combination.', 401)
    }

    const passwordConfirmed = await this.hashProvider.compareHash(password, user.password)

    if(!passwordConfirmed){
      throw new AppError('Incorret email/password combination.', 401)
    }

    const token  = sign({}, authConfig.jwt.secret as Secret, {
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
