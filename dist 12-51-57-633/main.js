"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const encryption_1 = require("./common/interceptor/encryption");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('edg');
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalInterceptors(new encryption_1.EncryptInterceptor());
    await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
