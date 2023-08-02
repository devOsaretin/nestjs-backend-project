import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  repo: Repository<User>;

  constructor(@InjectRepository(User) repo: Repository<User>) {
    this.repo = repo;
  }

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return await this.repo.save(user);
  }

  async findOne(id: number) {
    return await this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, values: Partial<User>) {
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, values);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.repo.remove(user);
  }
}
