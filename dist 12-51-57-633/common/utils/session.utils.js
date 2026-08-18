"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.generateSession = generateSession;
const encoding_1 = require("@oslojs/encoding");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function hashPassword(raw) {
    const pwSalt = 10;
    return bcrypt_1.default.hash(raw, pwSalt);
}
function generateSession() {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = (0, encoding_1.encodeBase32LowerCaseNoPadding)(bytes);
    return token;
}
// export function
