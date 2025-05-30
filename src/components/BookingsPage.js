import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import dayjs from "dayjs";

const BOOKINGS_URL = "http://localhost:5000/api/bookings";

const BookingsPage = ({ members }) => {
  const [daysAgo, setDaysAgo] = useState(0);
  const [dayCount, setDayCount] = useState(7);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const date = dayjs().subtract(daysAgo, "day").format("YYYY-MM-DD");
      const res = await fetch(`${BOOKINGS_URL}?from=${date}&days=${dayCount}`);
      const data = await res.json();
      setBookings(data);
    };

    fetchBookings();
  }, [daysAgo, dayCount]);

  useEffect(() => {
    const allAccountIds = bookings
      .flatMap((b) => b.bookings)
      .map((bk) => bk.accountId);
    console.log("All booking accountIds:", allAccountIds);
  }, [bookings]);

  const formatTime = (timestamp) => dayjs(timestamp).format("DD.MM.YYYY HH:mm");

  return (
    <Container maxWidth="lg" sx={{ pt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bookings
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <FormControl fullWidth>
            <Select
              value={daysAgo}
              onChange={(e) => setDaysAgo(e.target.value)}
            >
              {[0, 30, 60].map((val) => (
                <MenuItem key={val} value={val}>
                  {val} days ago
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl fullWidth>
            <Select
              value={dayCount}
              onChange={(e) => setDayCount(e.target.value)}
            >
              {[0, 7, 14, 21].map((val) => (
                <MenuItem key={val} value={val}>
                  Next {val} days
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {bookings.map((b) => (
          <Grid item xs={12} sm={6} md={4} key={b.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{b.resources[0]?.name}</Typography>
                <Typography>
                  {formatTime(b.startTs)} - {formatTime(b.endTs)}
                </Typography>
                <Typography color="text.secondary">
                  {b.infoText || "No info"}
                </Typography>
                {b.bookings.map((bk) => {
                  const member = members.find(
                    (m) =>
                      m.bookingId?.toLowerCase() === bk.accountId?.toLowerCase()
                  );
                  console.log("bk.accountId:", bk.accountId);
                  console.log("Matched member:", member);

                  return (
                    <Typography key={bk.id}>
                      • {member?.navn || "Unknown"}
                    </Typography>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BookingsPage;
