import AppError from "@shared/errors/AppError"
import path from 'path'
import { getCustomRepository } from "typeorm"
import UsersRepository from "../infra/typeorm/repositories/UsersRepository"
import UsersTokensRepository from "../infra/typeorm/repositories/UsersTokensRepository"
import EtherealMail from '@config/mail/EtherealMail'
import SESMail from '@config/mail/SESMail'
import mailConfig from '@config/mail/mail'
import { inject } from "tsyringe"
import { IUsersRepository } from "../domain/repositories/IUsersRepository"
import { IUserTokensRepository } from "../domain/repositories/IUserTokensRepository"

interface IRequest {
  email: string
}

export default class SendForgotPasswordEmailService {

  constructor(
    @inject('UsersRepository') private usersRepo: IUsersRepository,
    @inject('UsersTokensRepository') private usersTokensRepo: IUserTokensRepository
    ){}

  public async execute({email} : IRequest): Promise<void>{

    const user = await this.usersRepo.findByEmail(email)

    if(!user){
      throw new AppError('User does not exists.')
    }

    const {token} = await this.usersTokensRepo.generate(user.id)

    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs')

    if(mailConfig.driver === 'ses'){

      await SESMail.sendMail({
        to: {
          name: user.name,
          email: user.email
        },
        subject: '[APIVENDAS] Recuperação de senha',
        templateData: {
          file: forgotPasswordTemplate,
          variables: {
            name: user.name,
            link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`
          }
        }
      })
      return
    }

    await EtherealMail.sendMail({
      to: {
        name: user.name,
        email: user.email
      },
      subject: '[APIVENDAS] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`
        }
      }
    })
  }
}