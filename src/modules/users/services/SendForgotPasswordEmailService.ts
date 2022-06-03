import AppError from "@shared/errors/AppError"
import path from 'path'
import { getCustomRepository } from "typeorm"
import UsersRepository from "../typeorm/repositories/UsersRepository"
import UsersTokensRepository from "../typeorm/repositories/UsersTokensRepository"
import EtherealMail from '@config/mail/EtherealMail'
import SESMail from '@config/mail/SESMail'
import mailConfig from '@config/mail/mail'

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

    const {token} = await usersTokensRepository.generate(user.id)

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