import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./models/User.models";
import { authenticateOAuth } from "./middlewares/auth.middleware";
import { OAuth2Client } from "google-auth-library";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Set this to your frontend domain
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to `true` in production with HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);

        let user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (!user) {
          user = new User({
            email: profile.emails?.[0]?.value,
            credits: 5,
            refreshtoken: refreshToken || null,
          });

          try {
            await user.save(); // Save the new user
            console.log("User created and saved:", user);
          } catch (error) {
            console.error("Error saving new user:", error);
            return done(error, false);
          }
        } else {
          // If user exists, update the refresh token if necessary
          if (refreshToken && refreshToken !== user.refreshtoken) {
            user.refreshtoken = refreshToken;

            try {
              await user.save(); // Update the existing user
              console.log("User updated and saved:", user);
            } catch (error) {
              console.error("Error updating user:", error);
              return done(error, false);
            }
          }
        }

        (profile as any).accessToken = accessToken;
        return done(null, profile);
      } catch (error) {
        console.error("Error in GoogleStrategy:", error);
        return done(error, false);
      }
    }
  )
);



passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});



// Google OAuth Login Route
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  accessType: 'offline',
  prompt: 'consent',
}));
// OAuth callback route
// OAuth callback route
app.get(
  "/oauthcallback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      // Access the refresh token from the request object
      const refreshToken = req.user.refreshToken;

      // Store the refresh token in your database
      const user = await User.findOne({ email: req.user.emails[0].value });
      if (user) {
        user.refreshtoken = refreshToken;
        await user.save();
      } else {
        // Handle the case where the user is not found
        console.error("User not found in the database.");
      }

      // Redirect to your frontend page after login
      res.redirect(`http://localhost:5175/browse`);
    } catch (error) {
      console.error("Error in OAuth callback:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);



// Profile Route (User must be logged in)
app.get("/profile", async (req: Request, res: Response): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Retrieve the user's refresh token from the database
  const user = await User.findOne({ email: req.user.emails?.[0]?.value });
  if (!user) {
    return res.status(400).json({ message: "Refresh token not found" });
  }

  // Initialize the OAuth2 client
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!
  );

  // Set the credentials with the stored refresh token
  oauth2Client.setCredentials({
    refresh_token: user.refreshtoken,
  });

  try {
    // Get a new access token using the refresh token
    const { credentials } = await oauth2Client.refreshAccessToken();
    const newAccessToken = credentials.access_token;

    // Include the new access token in the response
    res.json({ user: req.user, accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: "Failed to refresh access token", error });
  }
});

// Logout Route
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
});

import Serachrouter from "./routes/search.route";

app.use(Serachrouter);

export default app;
