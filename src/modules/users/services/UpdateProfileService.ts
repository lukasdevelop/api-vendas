import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IUpdateProfile } from "../domain/models/IUpdateProfile";
import { IUser } from "../domain/models/IUser";
import UsersRepository from "../infra/typeorm/repositories/UsersRepository";
import { IHashProvider } from "../providers/HashProvider/models/IHashProvider";

interface IRequest {
  user_id: string
  name: string
  email: string
  password?: string
  old_password?: string
}
@injectable()
export default class UpdateProfileService {

  constructor(
    @inject('UsersRepository') private usersRepo: UsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider
    ){}

  public async execute({user_id, name, email, password, old_password}: IUpdateProfile): Promise<IUser>{

    const user = await this.usersRepo.findById(user_id)

    if(!user){
      throw new AppError('User not found.')
    }

    const userUpdateEmail = await this.usersRepo.findByEmail(email)

    if(userUpdateEmail && userUpdateEmail.id !== user_id){
      throw new AppError('There is already one user with this email.')
    }

    if(password && !old_password){
      throw new AppError('Old password is required.')
    }

    if(password && old_password){
      const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password)

      if(!checkOldPassword){
        throw new AppError('Old password does not match.')
      }

      user.password = await this.hashProvider.generateHash(password)
    }

    user.name = name
    user.email = email

    await this.usersRepo.save(user)

    return user
  }
}