import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";

import Filters from "../Filters";
import PaginationControls from "../PaginationControls";
import BookingCard from "./BookingCard";
import BookingStats from "./BookingStats";
import BookingFilters from "./BookingFilters";
import BookingCalendar from "./BookingCalendar";
import dayjs from "dayjs";

const BOOKINGS_URL = "http://localhost:5000/api/bookings";
const ITEMS_PER_PAGE = 6;
const BOOKING_CACHE_KEY = "itpk-bookings-cache";
const CACHE_EXPIRATION_MINUTES = 15;

const isCacheValid = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = (now - then) / (1000 * 60);
  return diff < CACHE_EXPIRATION_MINUTES;
};

const BookingsPage = ({ members }) => {
  const [daysAgo, setDaysAgo] = useState(0);
  const [dayCount, setDayCount] = useState(7);
  const [bookings, setBookings] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showOnlySingles, setShowOnlySingles] = useState(false);
  const [sportFilter, setSportFilter] = useState("all");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const cacheKey = `${BOOKING_CACHE_KEY}-${daysAgo}-${dayCount}`;
      const cached = JSON.parse(localStorage.getItem(cacheKey));

      if (cached && isCacheValid(cached.timestamp)) {
        setBookings(cached.data);
        setLoading(false);
        return;
      }

      const date = dayjs().subtract(daysAgo, "day").format("YYYY-MM-DD");
      const res = await fetch(`${BOOKINGS_URL}?from=${date}&days=${dayCount}`);
      const data = await res.json();

      localStorage.setItem(
        cacheKey,
        JSON.stringify({ data, timestamp: new Date() })
      );

      setBookings(data);
      setLoading(false);
    };

    fetchBookings();
  }, [daysAgo, dayCount]);

  const getTopMembersByBookings = (keyword) => {
    const countMap = {};
    bookings.forEach((b) => {
      if (!b.resources[0]?.name.toLowerCase().includes(keyword)) return;
      b.bookings.forEach((bk) => {
        const id = bk.accountId?.toLowerCase();
        if (!id) return;
        countMap[id] = (countMap[id] || 0) + 1;
      });
    });

    return Object.entries(countMap)
      .map(([id, count]) => ({
        bookingId: id,
        count,
        navn:
          members.find((m) => m.bookingId?.toLowerCase() === id)?.navn ||
          "Unknown",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const stats = {
    tennis: getTopMembersByBookings("tennis"),
    padel: getTopMembersByBookings("padel"),
  };

  const filtered = bookings.filter((b) => {
    const memberMatch = b.bookings.some((bk) =>
      members
        .find((m) => m.bookingId?.toLowerCase() === bk.accountId?.toLowerCase())
        ?.navn?.toLowerCase()
        ?.includes(searchName.toLowerCase())
    );
    const countMatch = showOnlySingles ? b.bookings.length === 1 : true;
    const sportMatch =
      sportFilter === "all"
        ? true
        : b.resources[0]?.name?.toLowerCase().includes(sportFilter);
    return memberMatch && countMatch && sportMatch;
  });

  const sorted = [...filtered].sort((a, b) =>
    sortDirection === "asc"
      ? new Date(a.startTs) - new Date(b.startTs)
      : new Date(b.startTs) - new Date(a.startTs)
  );

  const paginated = sorted.slice(
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
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Filters searchName={searchName} setSearchName={setSearchName} />
            <BookingFilters
              daysAgo={daysAgo}
              setDaysAgo={setDaysAgo}
              dayCount={dayCount}
              setDayCount={setDayCount}
              showOnlySingles={showOnlySingles}
              setShowOnlySingles={setShowOnlySingles}
              sportFilter={sportFilter}
              setSportFilter={setSportFilter}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: 2,
              }}
            >
              {paginated.map((b) => (
                <BookingCard key={b.id} booking={b} members={members} />
              ))}
            </Box>
            <PaginationControls
              count={Math.ceil(filtered.length / ITEMS_PER_PAGE)}
              page={page}
              setPage={setPage}
            />
          </Box>

          {!isSmallScreen && (
            <Box
              sx={{
                width: 300,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                  width: "fit-content",
                  bgcolor: "background.paper",
                }}
              >
                <BookingCalendar bookings={bookings} />
              </Box>
              <BookingStats stats={stats} />
            </Box>
          )}
        </Box>
      )}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
            width: "fit-content",
            bgcolor: "background.paper",
          }}
        >
          <BookingCalendar bookings={bookings} />
        </Box>
        <Box sx={{ width: 300, p: 2 }}>
          <BookingStats stats={stats} />
        </Box>
      </Drawer>
    </Container>
  );
};

export default BookingsPage;
