import { AppDataSource } from './../../data-source';
import { Member } from './../models/Member';
import passport = require("passport");
import { Profile, Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20'

passport.serializeUser((user: Member, done: VerifyCallback) => {
    done(null, user.id);
 });
 
passport.deserializeUser(async (id: number, done: VerifyCallback) => {
   const USER = await AppDataSource.getRepository(Member).findOneByOrFail({ id: id })
   done(null, USER);
 });

passport.use(new GoogleStrategy (
    {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_REDIRECT_URL,
        scope: ['email', 'profile']
    }, 
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        // check if user already exist in our db
        const oldUser = await AppDataSource.getRepository(Member).findOneBy({ email: profile.emails[0].value })
        
        if (oldUser) {
            return done(null, oldUser);
        } else {
            const newUser: Member = new Member()
            newUser.email = profile.emails[0].value,
            newUser.username = profile.emails[0].value,
            newUser.image = profile.photos[0].value

            try {
                await AppDataSource.getRepository(Member).save(newUser)    
                return done(null, newUser);
            } catch (error) {
                return
            }
        }
    }
))