import {createSchema, ExtractDoc, Type, typedModel} from 'ts-mongoose';
import validator from 'validator'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator"

const feedSchema = createSchema(
    { content: Type.string({ required: true }), type:Type.string()},
    { _id: false, timestamps: true }
)


const userSchema = createSchema(
    {
        name: Type.string({ required: true, unique: true, trim: true }),
        email: Type.string({ required: true, unique: true,lowercase:true,validate: value=>{
                if (!validator.isEmail(value)) {
                    throw new Error( "Invalid Email address");}}}),
        password:Type.number({ required: true, minlength:4}),
        sessionTokens:Type.array().of(Type.string({required:true,name:"token"})),


        description: Type.string({ required: false, default:"" }),
        location: Type.string({ required: false, default:"" }),
        avatarURL:Type.string({ required: false, default:"" }),
        headerURL:Type.string({ required: false, default:"" }),
        additionalURL:Type.string({ required: false, default:"" }),

        reputation:Type.number({ required: false, default:0 }),
        subscriptions:Type.array().of(feedSchema),


        enabled: Type.boolean({default:true}),
        blocked: Type.boolean({default:false}),
        flag: Type.number({default:0}),
        creationTimestamp: Type.date({default:Date.now})
    },
    { _id: true, timestamps: false }
);
userSchema.plugin(uniqueValidator, { message: "{PATH}" });

type UserDoc = ExtractDoc<typeof userSchema>;
userSchema.pre("save", async function(this: UserDoc, next) {
    // Hash the password before saving the user model
    const user: UserDoc=this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.methods.generateAuthToken = async function(this: UserDoc) {
    // Generate an auth token for the user
    const user:UserDoc = this;
    const token = jwt.sign({ _id: user._id }, "DPAJWTKEY");
    user.sessionTokens = user.sessionTokens.concat(token);
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.´
    const user:UserDoc = await userModel.findOne({ email }).exec();

    if (!user) {
        throw new Error("300");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error("301");
    }

    return user;
};


export const userModel= typedModel('Users', userSchema);
