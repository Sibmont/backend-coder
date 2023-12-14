import passport from "passport";
import GithubStrategy from "passport-github2";
import local from "passport-local";
import usersModel from "../dao/managers/dbManagers/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";

// Create local strategy
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  // Local Register implementation
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;
          const user = await usersModel.findOne({ username });

          if (user) return done(null, false);

          const userToSave = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
          };

          const result = await usersModel.create(userToSave);
          return done(null, result);
        } catch (error) {
          return done("Incorrect credentials");
        }
      }
    )
  );

  // Local Login implementation
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await usersModel.findOne({ email: username });

          if (!user || !isValidPassword(password, user.password)) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done("Incorrect credentials");
        }
      }
    )
  );

  //   Github register implementation
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.b0c7adbc6d614b21",
        clientSecret: "1f81536d95d129fd9467c6105d9b2d10bee6cb5b",
        callbackURL: "http://localhost:8080/api/sessions/github-callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;

          const user = await usersModel.findOne({ email });

          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              email,
            };

            const result = await usersModel.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done("Incorrect credentials");
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await usersModel.findById(id);
    done(null, user);
  });
};

export { initializePassport };
