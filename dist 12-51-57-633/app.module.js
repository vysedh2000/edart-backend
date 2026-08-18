"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const config_1 = require("@nestjs/config"); // Added ConfigService
const auth_module_1 = require("./module/auth.module");
const ioredis_1 = require("@nestjs-modules/ioredis"); // Added RedisModule
const asset_module_1 = require("./module/asset.module");
const transfer_module_1 = require("./module/transfer.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            asset_module_1.AssetModule,
            transfer_module_1.TransferModule,
            // Register Redis dynamically using your global ConfigModule
            ioredis_1.RedisModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
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
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
