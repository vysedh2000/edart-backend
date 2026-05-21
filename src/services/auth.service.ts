import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { userLoginDto, userSession, userSignUpDto } from '../dtos/auth.dto';
import { generateSession, hashPassword } from '../common/utils/session.utils';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { comparePassword } from '../utils/authUtils';
import { createUserResponse } from '../external/core.dto';
import { createUser } from '../external/core.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

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
    );
    var ttlInSeconds = payload.remember === 'Y' ? 259200 : 2592000;
    await this.redis
      .multi()
      .hdel('session', session.auth_id)
      .hset('session', session.auth_id, session.token)
      .call('HEXPIRE', 'session', ttlInSeconds, 'FIELDS', '1', session.auth_id)
      .exec();
    return session;
  }

  async signup(payload: userSignUpDto): Promise<any> {
    try {
      const hashPw = await hashPassword(payload.password);
      const coreResponse: createUserResponse = await createUser(payload);
      const auth = await this.prismaService.auth.create({
        data: {
          userId: coreResponse.uid,
          username: payload.username,
          email: payload.email,
          password: hashPw,
        },
      });
      const sessionToken = generateSession();
      const session: userSession = await this.createSession(
        sessionToken,
        auth.userId,
        auth.aid,
      );
      var ttlInSeconds = 259200;
      await this.redis
        .multi()
        .hdel('session', session.auth_id)
        .hset('session', session.auth_id, session.token)
        .call(
          'HEXPIRE',
          'session',
          ttlInSeconds,
          'FIELDS',
          '1',
          session.auth_id,
        )
        .exec();
      return session;
    } catch (e: any) {
      throw e;
    }
  }

  public async createSession(
    token: string,
    uid: string,
    aid: string,
  ): Promise<userSession> {
    try {
      const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token)),
      );
      const session: userSession = {
        token: sessionId,
        auth_id: aid,
        user_id: uid,
      };

      return session;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  public async getUser(authid: string) {
    const user = this.prismaService.auth.findFirst({
      where: {
        aid: authid,
      },
      omit: {
        password: true,
      },
    });
    return user;
  }
}
