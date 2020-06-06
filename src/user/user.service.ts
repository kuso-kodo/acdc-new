import { Injectable } from '@nestjs/common'

export type User = any;

@Injectable()
export class UserService {
    private readonly user: User[];

    constructor() {
        this.user = [
            {
                userId: 1,
                username: 'user',
                password: 'password',
            }
        ]
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.user.find(user => user.username == username);
    }
}