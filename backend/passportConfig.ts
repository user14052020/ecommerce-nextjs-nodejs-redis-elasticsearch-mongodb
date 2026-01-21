import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import Users, { UsersDocument } from "@app/models/users.model";
import { Request } from "express";

import "dotenv/config";

const cookieExtractor = (req: Request): string | null => {
  const token = req?.cookies?.["access_token"];
  return typeof token === "string" ? token : null;
};

// Authorization
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.PASPORTJS_KEY,
    },
    (payload: { sub?: string }, done) => {
      if (!payload?.sub) {
        return done(null, false);
      }
      Users.findById(payload.sub, (err: Error | null, user?: UsersDocument | null) => {
        if (err) return done(err, false);

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);

// Authentication password local strategy using username and password
passport.use(
  new LocalStrategy((username, password, done) => {
    Users.findOne({ username }, (err: Error | null, user?: UsersDocument | null) => {
      //something went wrong databese error
      if (err) return done(err);

      //if no user error exits
      if (!user) return done(null, false);
      user.comparePassword(password, done);
    });
  })
);

export default passport;
