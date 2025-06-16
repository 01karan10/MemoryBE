"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_secret = exports.MongoUrl = void 0;
exports.GenerateHash = GenerateHash;
exports.MongoUrl = "mongodb://127.0.0.1:27017/brain";
exports.JWT_secret = "@YR#*()(Q";
function GenerateHash(n) {
    let options = "!@#$%^&*()_+qwertyuioasdfghjklzxcvbnm12345678";
    let len = options.length;
    let ans = "";
    while (n--)
        ans += options[Math.floor((Math.random() * len))];
    return ans;
}
