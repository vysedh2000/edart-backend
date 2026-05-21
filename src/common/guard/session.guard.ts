import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SessionGuard implements CanActivate {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      username: process.env.REDIS_USER,
      password: process.env.REDIS_PW,
      keepAlive: 10000,
      retryStrategy(times) {
        const delay = Math.min(times * 100, 3000);
        return delay;
      },

      reconnectOnError(err) {
        const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];
        if (targetErrors.some((msg) => err.message.includes(msg))) {
          return true;
        }
        return false;
      },
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies?.['session_token'];
    const authid = request.cookies?.['authid'];

    if (!token) {
      throw new UnauthorizedException('No session token attached!');
    }

    if (!authid) {
      throw new UnauthorizedException('No auth ID provided!');
    }

    const sessionToken = await this.redisClient.hget('session', authid);

    if (!sessionToken) {
      throw new UnauthorizedException('Session not found!');
    }

    if (sessionToken !== token) {
      throw new UnauthorizedException('Token does not match!');
    }

    return true;
  }
}
