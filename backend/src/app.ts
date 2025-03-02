import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./models/User.models";
import { OAuth2Client } from "google-auth-library";
import { authenticateOAuth } from "./middlewares/auth.middleware";

// Extend the Express Request type to include user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

const app = express();

// Environment variables check
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("Missing required environment variables for Google OAuth");
  process.exit(1);
}

// Middleware setup - proper order is important
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5175",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser(process.env.SESSION_SECRET || "yourSecretKey")); // Use same secret as session

// Session middleware - must come before passport middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: true, // Changed to true to ensure session is saved
    saveUninitialized: true, // Changed to true for testing
    cookie: { 
      secure: false, // Must be false for non-HTTPS local development
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      sameSite: 'lax'
    },
    name: 'connect.sid' // Default name, explicitly set for clarity
  })
);

// Initialize passport after session middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/oauthcallback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        

        // Get email from profile
        const email = profile.emails?.[0]?.value;
        if (!email) {
          console.error("No email found in Google profile");
          return done(new Error("No email found in Google profile"), false);
        }

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
          console.log("Creating new user with email:", email);
          user = new User({
            email,
            credits: 5,
            refreshtoken: refreshToken || null,
          });

          try {
            await user.save();
            console.log("User created and saved:", user);
          } catch (error) {
            console.error("Error saving new user:", error);
            return done(error, false);
          }
        } else {
          console.log("User found:", user);
          // Update existing user if necessary
          if (refreshToken && refreshToken !== user.refreshtoken) {
            user.refreshtoken = refreshToken;
            try {
              await user.save();
              console.log("User updated with new refresh token");
            } catch (error) {
              console.error("Error updating user:", error);
              return done(error, false);
            }
          }
        }

        // Create user object for session
        const userForSession = {
          id: user._id.toString(),
          email: user.email,
          credits: user.credits,
          name: profile.displayName || email.split('@')[0],
          picture: profile.photos?.[0]?.value
        };

        console.log("User object for session:", userForSession);
        return done(null, userForSession);
      } catch (error) {
        console.error("Error in GoogleStrategy:", error);
        return done(error, false);
      }
    }
  )
);

// User serialization - what goes into the session
passport.serializeUser((user: any, done) => {
  
  // Store only the user ID in the session
  done(null, user.id);
});

// User deserialization - how to get user data from the stored session ID
passport.deserializeUser(async (id: string, done) => {
  
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("User not found during deserialization");
      return done(null, false);
    }
    // Return user object without sensitive data
    const userForRequest = {
      id: user._id,
      email: user.email,
      credits: user.credits
    };
    return done(null, userForRequest);
  } catch (error) {
    console.error("Error deserializing user:", error);
    return done(error, false);
  }
});

// 

// Google OAuth Login Route
app.get('/auth/google', (req, res, next) => {
 
  next();
}, passport.authenticate('google', {
  scope: ['profile', 'email'],
  accessType: 'offline',
  prompt: 'consent', // Force approval prompt to get refresh token
}));

// OAuth callback route
app.get(
  "/oauthcallback",
  (req, res, next) => {
    console.log("OAuth callback received");
    next();
  },
  passport.authenticate("google", { 
    failureRedirect: "http://localhost:5175/login?error=true"
  }),
  (req: Request, res: Response) => {
    
    
    // Verify the session is being saved properly
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).send("Error saving session");
      }
      res.redirect("http://localhost:5175/browse");
    });
  }
);

// Profile Route (Protected)
app.get('/profile', authenticateOAuth, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

// Auth status endpoint
// app.get('/auth/status', (req: Request, res: Response) => {
//   console.log("Auth status - Session:", req.session);
//   console.log("Auth status - isAuthenticated:", req.isAuthenticated());
//   console.log("Auth status - User:", req.user);
  
//   if (req.isAuthenticated()) {
//     return res.json({ 
//       authenticated: true, 
//       user: req.user 
//     });
//   }
//   return res.json({ authenticated: false });
// });

// Logout Route
app.get("/logout", (req: Request, res: Response) => {
  console.log("Logout initiated");
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Error during logout" });
    }
    // Clear the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      console.log("Session destroyed, clearing cookie");
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ message: "Logged out successfully" });
    });
  });
});

// Create separate middleware file for authenticateOAuth


// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    message: "Server error", 
    error: process.env.NODE_ENV === 'production' ? null : err.message 
  });
});

// Import your other routes
import SearchRouter from "./routes/search.route";
app.use("/", SearchRouter);

export default app;
