import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UsersService } from 'src/users/services';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { MockUserBuilder } from 'src/users/mocks/user';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginRequestDto, SignupRequestDto } from '../dtos';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: DeepMocked<UsersService>;
  let jwtService: DeepMocked<JwtService>;
  let tokenService: DeepMocked<TokenService>;

  beforeEach(async () => {
    usersService = createMock<UsersService>();
    jwtService = createMock<JwtService>();
    tokenService = createMock<TokenService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: TokenService,
          useValue: tokenService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });
  describe('logIn', () => {
    const loginDto: LoginRequestDto = {
      email: 'johndoe@gmail.com',
      password: 'password123',
    };

    it('should successfully login with correct credentials', async () => {
      const mockUser = new MockUserBuilder()
        .withEmail(loginDto.email)
        .withPassword(await bcrypt.hash(loginDto.password, 10))
        .build();

      const mockTokenId = 'mock-token-id-123';
      const mockAccessToken = 'mock-jwt-access-token';

      // we will bypass here
      usersService.findOne.mockResolvedValue(mockUser as any);
      tokenService.create.mockResolvedValue({ tokenId: mockTokenId } as any);
      jwtService.signAsync.mockResolvedValue(mockAccessToken);

      const result = await service.logIn(loginDto);

      expect(usersService.findOne).toHaveBeenCalledTimes(1);
      expect(tokenService.create).toHaveBeenCalledTimes(1);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockAccessToken);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersService.findOne.mockResolvedValue(null);

      await expect(service.logIn(loginDto)).rejects.toThrow(NotFoundException);

      expect(usersService.findOne).toHaveBeenCalledTimes(1);
      expect(tokenService.create).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const mockUser = new MockUserBuilder()
        .withEmail(loginDto.email)
        .withPassword(await bcrypt.hash('different-password', 10))
        .build();

      usersService.findOne.mockResolvedValue(mockUser as any);

      await expect(service.logIn(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findOne).toHaveBeenCalledTimes(1);
      expect(tokenService.create).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('signUp', () => {
    const signupDto: SignupRequestDto = {
      email: 'newuser@gmail.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfBirth: '1995-05-15',
      phone: '+84901234567',
    };

    it('should successfully create a new user and return access token', async () => {
      const mockNewUser = new MockUserBuilder()
        .withEmail(signupDto.email)
        .withFirstName(signupDto.firstName)
        .withLastName(signupDto.lastName)
        .build();

      const mockAccessToken = 'mock-jwt-access-token';

      usersService.findOne.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockNewUser as any);
      jwtService.signAsync.mockResolvedValue(mockAccessToken);

      const result = await service.signUp(signupDto);

      expect(usersService.findOne).toHaveBeenCalledTimes(1);
      expect(usersService.create).toHaveBeenCalledTimes(1);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ access_token: mockAccessToken });
    });

    it('should throw UnauthorizedException when user already exists', async () => {
      const existingUser = new MockUserBuilder()
        .withEmail(signupDto.email)
        .build();

      usersService.findOne.mockResolvedValue(existingUser as any);

      await expect(service.signUp(signupDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findOne).toHaveBeenCalledTimes(1);
      expect(usersService.create).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
