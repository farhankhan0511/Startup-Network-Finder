  import 'dotenv/config'
  import app from "./app";
  import { DBConnect } from "./db/db";
  import { processEmails } from "./recredit";
  import cron from "node-cron";

  DBConnect()
    .then(() => {
      app.listen(process.env.PORT || 8080, () => {
        console.log("Server is running");
      });

      // Cron job to check and process emails every hour
      cron.schedule("*/10 * * * *", async () => {
        try {
          console.log("Running check task...");
          await processEmails(); // Process the emails for credit recharging
        } catch (error) {
          console.error("Error in credit check cron job:", error);
        }
      });

      console.log("Processing emails for regiving the credits when exhausted");
    })
    .catch((error) => {
      console.error("Error in DB connection:", error);
    });
