import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserProps } from 'src/users/entities/user.entity';
import { v4 as uuidV4 } from 'uuid';

export const validUserMock: UserProps = {
  id: uuidV4(),
  email: 'user@email.com',
  password: '123456',
};

export const validCreateUserDto: CreateUserDto = {
  email: 'user@email.com',
  password: '123456',
};
