const apiRoute = require("./routes/routes");
// IMPORTANT: Make sure to import `instrument.js` at the top of your file.
// If you're using ECMAScript Modules (ESM) syntax, use `import "./instrument.js";`
require("./instruments");

// All other imports below
// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");
const express = require("express");
const redis = require('redis');
const app = express();

// Create Redis client
const client = redis.createClient();
client.on('error', (err) => console.log('Redis Client Error', err));
(async () => {
  await client.connect(); // Connect to Redis

  // Initialize default companies if needed
  let companies = [{ id: 1079, nombre: "Carrefour", number: "5493543609446" }];
  await client.set('companies', JSON.stringify(companies));
})();

// Make Redis client available in request

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  req.redisClient = client;
  next();
});

app.use("/whatsapp", apiRoute);

Sentry.setupExpressErrorHandler(app);
// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
  });



app.listen(PORT, () => console.log("Listening port 3000"))