"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionGuard = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
let SessionGuard = class SessionGuard {
    redisClient;
    constructor() {
        this.redisClient = new ioredis_1.default({
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
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.['session_token'];
        const authid = request.cookies?.['authid'];
        if (!token) {
            throw new common_1.UnauthorizedException('No session token attached!');
        }
        if (!authid) {
            throw new common_1.UnauthorizedException('No auth ID provided!');
        }
        const sessionToken = await this.redisClient.hget('session', authid);
        if (!sessionToken) {
            throw new common_1.UnauthorizedException('Session not found!');
        }
        if (sessionToken !== token) {
            throw new common_1.UnauthorizedException('Token does not match!');
        }
        return true;
    }
};
exports.SessionGuard = SessionGuard;
exports.SessionGuard = SessionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SessionGuard);
