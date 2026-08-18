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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const session_utils_1 = require("../common/utils/session.utils");
const encoding_1 = require("@oslojs/encoding");
const sha2_1 = require("@oslojs/crypto/sha2");
const authUtils_1 = require("../utils/authUtils");
const ioredis_1 = require("@nestjs-modules/ioredis");
const ioredis_2 = __importDefault(require("ioredis"));
const core_service_1 = require("../external/core/core.service");
let AuthService = class AuthService {
    prismaService;
    redis;
    constructor(prismaService, redis) {
        this.prismaService = prismaService;
        this.redis = redis;
    }
    async login(payload) {
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
        const isPasswordValid = await (0, authUtils_1.comparePassword)(payload.password, authInfo.password);
        if (!isPasswordValid) {
            return {
                statusCode: 'A0002',
                message: 'Invalid Credential!',
            };
        }
        const sessionToken = (0, session_utils_1.generateSession)();
        const session = await this.createSession(sessionToken, authInfo.userId, authInfo.aid);
        var ttlInSeconds = payload.remember === 'Y' ? 259200 : 2592000;
        await this.redis
            .multi()
            .hdel('session', session.auth_id)
            .hset('session', session.auth_id, session.token)
            .call('HEXPIRE', 'session', ttlInSeconds, 'FIELDS', '1', session.auth_id)
            .exec();
        return session;
    }
    async signup(payload) {
        try {
            const hashPw = await (0, session_utils_1.hashPassword)(payload.password);
            const coreResponse = await (0, core_service_1.createUser)(payload);
            const auth = await this.prismaService.auth.create({
                data: {
                    userId: coreResponse.uid,
                    username: payload.username,
                    email: payload.email,
                    password: hashPw,
                    ccy: 'USD',
                },
            });
            const sessionToken = (0, session_utils_1.generateSession)();
            const session = await this.createSession(sessionToken, auth.userId, auth.aid);
            var ttlInSeconds = 259200;
            await this.redis
                .multi()
                .hdel('session', session.auth_id)
                .hset('session', session.auth_id, session.token)
                .call('HEXPIRE', 'session', ttlInSeconds, 'FIELDS', '1', session.auth_id)
                .exec();
            return session;
        }
        catch (e) {
            throw e;
        }
    }
    async createSession(token, uid, aid) {
        try {
            const sessionId = (0, encoding_1.encodeHexLowerCase)((0, sha2_1.sha256)(new TextEncoder().encode(token)));
            const session = {
                token: sessionId,
                auth_id: aid,
                user_id: uid,
            };
            return session;
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
    async getUser(authid) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, ioredis_1.InjectRedis)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ioredis_2.default])
], AuthService);
