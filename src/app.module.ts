import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Added ConfigService
import { AuthModule } from './module/auth.module';
import { RedisModule } from '@nestjs-modules/ioredis'; // Added RedisModule
import { AssetModule } from './module/asset.module';
import { TransferModule } from './module/transfer.module';
import { DepositModule } from './module/deposit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AssetModule,
    TransferModule,
    DepositModule,

    // Register Redis dynamically using your global ConfigModule
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: process.env.REDIS_URL,
        options: {
          // 1. Keep the TCP connection alive at the OS level (probes every 10s)
          keepAlive: 10000,

          // 2. Strategy to reconnect when serverless drops the socket
          retryStrategy(times) {
            // Log it if you want to track it: console.warn(`Redis reconnecting: attempt ${times}`);
            const delay = Math.min(times * 100, 3000);
            return delay; // Back off up to 3 seconds between retries
          },

          // 3. Reconnect if the server throws specific connection reset errors
          reconnectOnError(err) {
            const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];
            if (targetErrors.some((msg) => err.message.includes(msg))) {
              return true; // Force a fresh reconnection
            }
            return false;
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
