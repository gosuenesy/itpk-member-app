import express from "express";
import cors from "cors";
import { XMLParser } from "fast-xml-parser";
import fetch from "node-fetch"; 
import axios from "axios";

const app = express();
app.use(cors());

const TOKEN_URL = "https://bookingportal.com/auth/token";
const MEMBERS_URL =
  "https://bookingportal.com/api/organizations/5d857c38-030c-47eb-826a-a74400a4fc12/memberslist";

const CLIENT_CREDENTIALS = Buffer.from("3:thebookingportal").toString("base64");

app.get("/api/members", async (req, res) => {
  const url =
    "https://www.conventus.dk/dataudv/api/adressebog/get_medlemmer.php?forening=16009&key=jHgcxKcct0egiOj7ghMy6dv0nTFwZnN0VUcivelOdpVm55jacVz8ZU8cECzuQdtC&id=4388768&type=medlem";

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Node.js proxy)" },
    });

    if (!response.ok)
      throw new Error(`Conventus responded with status ${response.status}`);

    const xml = await response.text();
    const parser = new XMLParser();
    const json = parser.parse(xml);
    res.json(json);
  } catch (err) {
    console.error("Proxy error (Conventus):", err.message);
    res.status(500).send("Conventus proxy fetch failed: " + err.message);
  }
});

app.get("/api/booking-members", async (req, res) => {
  try {
    const tokenResponse = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        username: "api@itpk.dk",
        password: "ITPKAPI25",
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
        "User-Agent": "PostmanRuntime/7.44.0",
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
      },
    });

    res.json(membersResponse.data);
  } catch (err) {
    console.error("Bookingportal API error:", err.message);

    if (err.response) {
      console.error("Bookingportal response data:", err.response.data);
      res.status(err.response.status).json(err.response.data);
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

app.listen(5000, () => {
  console.log("Proxy server running on http://localhost:5000");
});
