import express from "express";
import cors from "cors";
import { XMLParser } from "fast-xml-parser";
import fetch from "node-fetch";
import axios from "axios";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

const TOKEN_URL = "https://bookingportal.com/auth/token";
const MEMBERS_URL =
  "https://bookingportal.com/api/organizations/5d857c38-030c-47eb-826a-a74400a4fc12/memberslist?searchText=&offset=0&limit=10000";

const CLIENT_CREDENTIALS = Buffer.from("3:thebookingportal").toString("base64");

app.get("/api/members", async (req, res) => {
  const conventusKey = process.env.conventus;
  const conventusUrl = `https://www.conventus.dk/dataudv/api/adressebog/get_medlemmer.php?forening=16009&key=${conventusKey}&id=4388768&type=medlem`;

  try {
    const response = await fetch(conventusUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Node.js proxy)" },
    });

    if (!response.ok) {
      throw new Error(`Conventus responded with status ${response.status}`);
    }

    const xml = await response.text();
    const parser = new XMLParser();
    const json = parser.parse(xml);
    res.json(json);
  } catch (err) {
    console.error("Conventus API error:", err.message);
    res.status(500).send("Conventus proxy fetch failed: " + err.message);
  }
});

app.get("/api/booking-members", async (req, res) => {
  try {
    const username = process.env.username;
    const password = process.env.password;

    const tokenResponse = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        username,
        password,
        grant_type: "password",
      }),
      {
        headers: {
          Authorization: `Basic ${CLIENT_CREDENTIALS}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) throw new Error("No access token returned");

    const membersResponse = await axios.get(MEMBERS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Node.js/Render",
        Accept: "*/*",
      },
    });

    res.json(membersResponse.data);
  } catch (err) {
    console.error("Bookingportal API error:", err.message);
    if (err.response) {
      console.error("Bookingportal response:", err.response.data);
      res.status(err.response.status).json(err.response.data);
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const { from, days } = req.query;

    const username = process.env.username;
    const password = process.env.password;

    const tokenResponse = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        username,
        password,
        grant_type: "password",
      }),
      {
        headers: {
          Authorization: `Basic ${CLIENT_CREDENTIALS}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const BOOKINGS_URL = `https://bookingportal.com/api/offerings/0077d00a-e37a-49bf-b449-a74400a7f812/resourcebookings?from=${from}&days=${days}`;

    const response = await axios.get(BOOKINGS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Node.js/Render",
        Accept: "*/*",
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Booking data fetch failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
