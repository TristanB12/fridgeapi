import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          lists: {
            create: [
              { name: 'Fridge' },
              { name: 'Freezer' },
              { name: 'Pantry' }
            ]
          }
        }
      });
      delete user.hash;
      return this.getAccessToken(user.id);
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new ForbiddenException('Credentials already taken');
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Incorrect email');
    if (!(await argon.verify(user.hash, dto.password)))
      throw new ForbiddenException('Incorrect password');
    delete user.hash;
    return this.getAccessToken(user.id);
  }

  private async getAccessToken(id: number) {
    const payload = {
      id
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      secret
    });
    return {
      access_token: token
    };
  }
}
