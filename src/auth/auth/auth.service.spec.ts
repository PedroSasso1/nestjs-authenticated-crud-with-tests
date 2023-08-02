import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/users.service';
import { validCreateUserDto } from '../../../test/mocks/user.mocks';
import { JwtService } from '@nestjs/jwt';
import { InvalidCredentialsException } from '../../errors/invalid-credentials-exception';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw invalid credentials', async () => {
    await userService.create(validCreateUserDto);
    expect(service.login(validCreateUserDto.email, '654321')).rejects.toThrow(
      InvalidCredentialsException,
    );
  });
});
