import { inject, injectable } from "tsyringe";
import { IPaginateUser } from "../domain/models/IPaginateUser";
import { IUsersRepository } from "../domain/repositories/IUsersRepository";

interface SearchParams {
  page: number
  limit: number
}
@injectable()
export default class ListUserService {

  constructor(@inject('UsersRepository') private usersRepo: IUsersRepository){}

  public async execute({page, limit}: SearchParams): Promise<IPaginateUser>{

    const take = limit
    const skip = (Number(page) - 1) * take

    const users = await this.usersRepo.findAll({
      page,
      skip,
      take
    })

    return users
  }
}