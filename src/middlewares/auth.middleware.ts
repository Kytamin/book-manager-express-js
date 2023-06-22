import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../models/schemas/user.model";
import GoogleStrategy from 'passport-google-oauth2';

passport.use(new Strategy(async function verify(username:string, password: string, cb) {
    const user = await User.findOne({username});
    if (!user) {
        return cb(null, false, { message: 'Incorrect username or password.' });
    }
    if (user.password !== password) {
        return cb(null, false, { message: 'Incorrect username or password.' });
    }
    return cb(null, user);
}))

passport.serializeUser((user: any, cb)  => {
    process.nextTick(() => {
        cb(null, { id: user._id, username: user.username, role: user.role });
    });
});

passport.deserializeUser((user: any, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    });
});
passport.use(new GoogleStrategy({
    clientID: "592878063533-956a1tk0av1rh5qkep1suovd4amjd1ku.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
},
async (request:any, accessToken:any, refreshToken:any, profile:any, done:any) => {
    try {
        console.log(profile, 'profile');
        let existingUser = await User.findOne({'google.id': profile.id})
        if (existingUser) {
            return done(null, existingUser);
        }
        console.log('Creating new user...');

        const newUser = new User({
            google: {
                id: profile.id
            },
            username: profile.emails[0].value,
            password: null,
            role: "user" 
        })
        await newUser.save();
        console.log(newUser, 'newUser');
        return done (null, newUser);
    } catch(err) {
        return done(null, false);
    }
}
))

export default passport;