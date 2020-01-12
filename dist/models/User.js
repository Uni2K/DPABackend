"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const feedSchema = ts_mongoose_1.createSchema({ content: ts_mongoose_1.Type.string({ required: true }), type: ts_mongoose_1.Type.string() }, { _id: false, timestamps: true });
exports.userSchema = ts_mongoose_1.createSchema({
    name: ts_mongoose_1.Type.string({ required: true, unique: true, trim: true }),
    email: ts_mongoose_1.Type.string({
        required: true, unique: true, lowercase: true, validate: value => {
            if (!validator_1.default.isEmail(value)) {
                throw new Error("Invalid Email address");
            }
        }
    }),
    password: ts_mongoose_1.Type.string({ required: true, minlength: 4 }),
    sessionTokens: ts_mongoose_1.Type.array().of(ts_mongoose_1.Type.string({ name: "token" })),
    description: ts_mongoose_1.Type.string({ required: false, default: "" }),
    location: ts_mongoose_1.Type.string({ required: false, default: "" }),
    avatarImage: ts_mongoose_1.Type.string({ required: false, default: "" }),
    headerURL: ts_mongoose_1.Type.string({ required: false, default: "" }),
    additionalURL: ts_mongoose_1.Type.string({ required: false, default: "" }),
    reputation: ts_mongoose_1.Type.number({ required: false, default: 0 }),
    subscriptions: ts_mongoose_1.Type.array().of(feedSchema),
    enabled: ts_mongoose_1.Type.boolean({ default: true }),
    blocked: ts_mongoose_1.Type.boolean({ default: false }),
    flag: ts_mongoose_1.Type.number({ default: 0 }),
    creationTimestamp: ts_mongoose_1.Type.date({ default: Date.now })
}, { _id: true, timestamps: false });
exports.userSchema.plugin(mongoose_unique_validator_1.default, { message: "{PATH}" });
exports.userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Hash the password before saving the user model
        const user = this;
        if (user.isModified("password")) {
            user.password = yield bcryptjs_1.default.hash(user.password, 8);
        }
        next();
    });
});
exports.userSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        // Generate an auth token for the user
        const user = this;
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, "DPAJWTKEY");
        user.sessionTokens = user.sessionTokens.concat(token);
        yield user.save();
        return token;
    });
};
exports.userSchema.statics.findByCredentials = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // Search for a user by email and password.´
    const user = yield exports.userModel.findOne({ email }).exec();
    if (!user) {
        throw new Error("300");
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error("301");
    }
    return user;
});
exports.userModel = ts_mongoose_1.typedModel('Users', exports.userSchema);
//# sourceMappingURL=User.js.map