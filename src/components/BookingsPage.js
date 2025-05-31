import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  FormControl,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";

import Filters from "./Filters";
import PaginationControls from "./PaginationControls";

const BOOKINGS_URL = "http://localhost:5000/api/bookings";
const ITEMS_PER_PAGE = 6;

const BookingsPage = ({ members }) => {
  const [daysAgo, setDaysAgo] = useState(0);
  const [dayCount, setDayCount] = useState(7);
  const [bookings, setBookings] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showOnlySingles, setShowOnlySingles] = useState(false);
  const [sportFilter, setSportFilter] = useState("all");

  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchBookings = async () => {
      const date = dayjs().subtract(daysAgo, "day").format("YYYY-MM-DD");
      const res = await fetch(`${BOOKINGS_URL}?from=${date}&days=${dayCount}`);
      const data = await res.json();
      setBookings(data);
    };

    fetchBookings();
  }, [daysAgo, dayCount]);

  const formatTime = (timestamp) => dayjs(timestamp).format("DD.MM.YYYY HH:mm");

  const getTopMembersByBookings = (bookings, members, keyword) => {
    const countMap = {};

    bookings.forEach((b) => {
      const resourceName = b.resources?.[0]?.name?.toLowerCase() || "";
      if (!resourceName.includes(keyword.toLowerCase())) return;

      b.bookings.forEach((bk) => {
        const id = bk.accountId?.toLowerCase();
        if (!id) return;
        countMap[id] = (countMap[id] || 0) + 1;
      });
    });

    return Object.entries(countMap)
      .map(([bookingId, count]) => {
        const member = members.find(
          (m) => m.bookingId?.toLowerCase() === bookingId
        );
        return {
          bookingId,
          count,
          navn: member?.navn || "Unknown",
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const tennisStats = getTopMembersByBookings(bookings, members, "tennis");
  const padelStats = getTopMembersByBookings(bookings, members, "padel");

  const statsCard = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Top Tennis Members
        </Typography>
        {tennisStats.map((entry, i) => (
          <Typography key={entry.bookingId}>
            {i + 1}. {entry.navn} ({entry.count})
          </Typography>
        ))}
      </Card>

      <Card sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Top Padel Members
        </Typography>
        {padelStats.map((entry, i) => (
          <Typography key={entry.bookingId}>
            {i + 1}. {entry.navn} ({entry.count})
          </Typography>
        ))}
      </Card>
    </Box>
  );

  const filteredBookings = bookings.filter((b) => {
    const matchByMember = b.bookings.some((bk) => {
      const member = members.find(
        (m) => m.bookingId?.toLowerCase() === bk.accountId?.toLowerCase()
      );
      return searchName
        ? member?.navn?.toLowerCase().includes(searchName.toLowerCase())
        : true;
    });

    const matchByCount = showOnlySingles ? b.bookings.length === 1 : true;

    const sportName = b.resources[0]?.name?.toLowerCase() || "";
    const matchBySport =
      sportFilter === "all"
        ? true
        : sportName.includes(sportFilter.toLowerCase());

    return matchByMember && matchByCount && matchBySport;
  });

  const paginatedBookings = filteredBookings.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Container maxWidth="lg" sx={{ pt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Bookings
        </Typography>
        {isSmallScreen && (
          <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            aria-label="Show stats"
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Filters searchName={searchName} setSearchName={setSearchName} />

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <FormControl sx={{ minWidth: 140 }}>
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
            <FormControl sx={{ minWidth: 140 }}>
              <Select
                value={dayCount}
                onChange={(e) => setDayCount(e.target.value)}
              >
                {[1, 7, 14, 30, 60].map((val) => (
                  <MenuItem key={val} value={val}>
                    Next {val} days
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Only 1 Member
              </Typography>
              <Switch
                checked={showOnlySingles}
                onChange={(e) => setShowOnlySingles(e.target.checked)}
              />
            </FormControl>
            <FormControl sx={{ minWidth: 140 }}>
              <Select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                displayEmpty
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="tennis">Tennis</MenuItem>
                <MenuItem value="padel">Padel</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            {paginatedBookings.map((b) => (
              <Card
                key={b.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  p: 2,
                  minHeight: 180,
                }}
                elevation={3}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{b.resources[0]?.name}</Typography>
                  <Typography>
                    {formatTime(b.startTs)} - {formatTime(b.endTs)}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  >
                    {b.infoText || null}
                  </Typography>
                  {b.bookings.map((bk) => {
                    const member = members.find(
                      (m) =>
                        m.bookingId?.toLowerCase() ===
                        bk.accountId?.toLowerCase()
                    );
                    return (
                      <Typography
                        key={bk.id}
                        color={member ? "text.primary" : "error"}
                      >
                        • {member?.navn || "Unknown"}
                      </Typography>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </Box>

          <PaginationControls
            count={Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)}
            page={page}
            setPage={setPage}
          />
        </Box>

        {!isSmallScreen && <Box sx={{ width: 300 }}>{statsCard}</Box>}
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>{statsCard}</Box>
      </Drawer>
    </Container>
  );
};

export default BookingsPage;
