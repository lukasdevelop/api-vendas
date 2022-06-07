import { ICreateUserDTO } from "@modules/users/domain/models/ICreateUserDTO.dto";
import { IPaginateUser } from "@modules/users/domain/models/IPaginateUser";
import { IUser } from "@modules/users/domain/models/IUser";
import { IUsersRepository } from "@modules/users/domain/repositories/IUsersRepository";
import { getRepository, Like, Repository } from "typeorm";
import User from "../entities/User";

type SearchParams = {
  page: number
  skip: number
  take: number
}

export default class UsersRepository implements IUsersRepository {

  constructor(private ormRepo: Repository<User>){
    this.ormRepo = getRepository(User)
  }
  
  public async create({name, email, password}: ICreateUserDTO): Promise<User> {
    const user = this.ormRepo.create({ name, email, password})

    await this.ormRepo.save(user)

    return user
  }

  public async save(user: IUser): Promise<User> {
    await this.ormRepo.save(user)

    return user
  }

  public async findAll({ page, skip, take}: SearchParams): Promise<IPaginateUser> {
    const [users, count] = await this.ormRepo
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .getManyAndCount()

      const result = {
        per_page: take,
        total: count,
        current_page: page,
        data: users
      }

    return result
  }

  public async findAllPaginate(search: string, sortField: string): Promise<IPaginateUser> {
    if(search){
      return (await this.ormRepo
        .createQueryBuilder()
        .where([ {name: Like(`%${search}`)}, {email: Like(`%${search}`)}])
        .orderBy(`User.name`, 'ASC')
        .paginate()) as IPaginateUser
    }

    return (await this.ormRepo
      .createQueryBuilder()
      .orderBy('User.name', 'ASC')
      .paginate()) as IPaginateUser
  }

  public async findByName(name: string): Promise<User | undefined>{
    const user = await this.ormRepo.findOne({
      where: {
        name,
      }
    })

    return user
  }

  public async findById(id: string): Promise<User | undefined>{
    const user = await this.ormRepo.findOne({
      where: {
        id
      }
    })

    return user
  }

  public async findByEmail(email: string): Promise<User | undefined>{
    const user = await this.ormRepo.findOne({
      where: {
        email
      }
    })

    return user
  }
}