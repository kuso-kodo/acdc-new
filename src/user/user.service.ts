import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entitiy/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {
        this.registerRootUser();
    }

    async registerRootUser() {
        const hasNoRootRegistered = await this.userRepository.count({ username: 'user' }) == 0;
        if (hasNoRootRegistered) {
            var rootUser = this.userRepository.create();
            rootUser.username = 'user';
            rootUser.password = 'password';
            this.userRepository.save(rootUser);
        }
    }

    async findOne(username: string): Promise<UserEntity | undefined> {
        return this.userRepository.findOne({username: username});
    }

    async findIdByName(username: string): Promise<number | undefined> {
        const user = await this.userRepository.findOne({ username: username });
        if(user) {
            return user.id
        }
        return undefined
    }
}