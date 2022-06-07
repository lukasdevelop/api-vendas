import AppError from '@shared/errors/AppError';
import path from 'path';
import fs from 'fs';
import { getCustomRepository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import uploadConfig from '@config/upload';
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider';
import S3StorageProvider from '@shared/providers/StorageProvider/S3StorageProvider';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUpdateUserAvatar } from '../domain/models/IUpdateUserAvatar';
import { IUser } from '../domain/models/IUser';

@injectable()
export default class UpdateUserAvatarService {

  constructor(@inject('UsersRepository') private userRepo: IUsersRepository){}
  
  public async execute({ user_id, avatarFilename }: IUpdateUserAvatar): Promise<IUser> {

    const user = await this.userRepo.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    if (uploadConfig.driver === 's3') {
      const s3Provider = new S3StorageProvider();

      if (user.avatar) {
        await s3Provider.deleteFile(user.avatar);
      }

      const filename = await s3Provider.saveFile(avatarFilename);

      user.avatar = filename

    } else {
      const diskProvider = new DiskStorageProvider();

      if (user.avatar) {
        await diskProvider.deleteFile(user.avatar);
      }

      const filename = await diskProvider.saveFile(avatarFilename);

      user.avatar = filename;

    }

    await this.userRepo.save(user);

    return user;
  }
}
