import express from "express";
import cors from "cors";
import axios from "axios";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
import { auth } from "express-oauth2-jwt-bearer";

const port = 8080;
const jwtCheck = auth({
  audience: "http://localhost:8080",
  issuerBaseURL: "https://dev-fkp34f1yfajuoqj7.au.auth0.com/",
  tokenSigningAlg: "RS256",
});
app.get("/", async (req, res) => {
  try {
    const auth0TokenUrl =
      "https://dev-fkp34f1yfajuoqj7.au.auth0.com/oauth/token";

    const requestBody = {
      client_id: "hanWFR3vzicbqnNH7gyt2GZinjcUVq7C",
      client_secret:
        "e9-S3uXkfZMtsVeCWddvjqFBfEzSZCP40rxgA3hdIOK4VgzuwDD8mVcfoGtnCq2a",
      audience: "http://localhost:8080",
      grant_type: "client_credentials",
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const response = await axios.post(auth0TokenUrl, requestBody, { headers });
    res.cookie("jwt", response.data.access_token, {
      secure: true,
      httpOnly: true,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching token:", error.message);
    res.status(500).json({ error: "Failed to fetch token" });
  }
});

app.get("/authorized", jwtCheck, function (req, res) {
  try {
    console.log(req.auth);
    res.send("Secured Resource");
  } catch (error) {
    res.json({ error });
  }
});

app.listen(port);

console.log("Running on port ", port);
