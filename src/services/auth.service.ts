import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  userLoginDto,
  userSession,
  userSignUpDto,
  userSignUpReponseDto,
} from '../dtos/auth.dto';
import { generateSession, hashPassword } from '../common/utils/session.utils';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { comparePassword } from '../utils/authUtils';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async login(payload: userLoginDto): Promise<any> {
    const authInfo = await this.prismaService.auth.findFirst({
      where: {
        OR: [{ username: payload.username }, { email: payload.email }],
      },
      omit: {
        password: false,
      },
    });
    if (!authInfo) {
      return {
        statusCode: 'A0001',
        message: 'Invalid Credential!',
      };
    }
    console.log(authInfo);
    const isPasswordValid = await comparePassword(
      payload.password,
      authInfo.password,
    );
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return {
        statusCode: 'A0002',
        message: 'Invalid Credential!',
      };
    }
    const sessionToken = generateSession();
    const session: userSession = await this.createSession(
      sessionToken,
      authInfo.userId,
      authInfo.aid,
      payload.remember === 'Y' ? true : false,
    );
    return session;
  }

  async signup(payload: userSignUpDto): Promise<any> {
    const hashPw = await hashPassword(payload.password);
    const auth = await this.prismaService.auth.create({
      data: {
        username: payload.username,
        email: payload.email,
        password: hashPw,
      },
    });
    await this.prismaService.appUser.create({
      data: {
        aid: auth.aid,
        name: payload.name,
      },
    });
    const sessionToken = generateSession();
    const session: userSession = await this.createSession(
      sessionToken,
      auth.userId,
      auth.aid,
      false,
    );
    return session;
  }

  public async createSession(
    token: string,
    uid: string,
    aid: string,
    noExp: boolean,
  ): Promise<userSession> {
    try {
      const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token)),
      );
      let expiration = 7 * 24 * 60 * 60 * 1000;
      if (noExp) {
        expiration = 360 * 24 * 60 * 60 * 1000;
      }
      const session: userSession = {
        id: sessionId,
        auth_id: aid,
        user_id: uid,
        expire_at: new Date(Date.now() + expiration),
      };

      return session;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
