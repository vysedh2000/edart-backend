"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = comparePassword;
exports.decodeToSessionId = decodeToSessionId;
const bcrypt_1 = __importDefault(require("bcrypt"));
const encoding_1 = require("@oslojs/encoding");
const sha2_1 = require("@oslojs/crypto/sha2");
async function comparePassword(password, hash) {
    return await bcrypt_1.default.compare(password, hash);
}
function decodeToSessionId(token) {
    return (0, encoding_1.encodeHexLowerCase)((0, sha2_1.sha256)(new TextEncoder().encode(token)));
}
