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
  Stack,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsTennisOutlinedIcon from "@mui/icons-material/SportsTennisOutlined";

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
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedStatSport, setSelectedStatSport] = useState("all");

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

  const renderStatsSection = (title, data) => (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6">{title}</Typography>

      {data.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No bookings
        </Typography>
      ) : (
        <Box component="ul" sx={{ pl: 2, mb: 0 }}>
          {data.map((entry, i) => (
            <Box key={entry.bookingId} component="li" sx={{ mb: 0.5 }}>
              <Tooltip title={`${entry.count} bookings`} arrow>
                <Typography variant="body2">
                  {i < 1 ? (
                    <EmojiEventsIcon
                      color="warning"
                      fontSize="small"
                      sx={{ verticalAlign: "middle", mr: 0.5 }}
                    />
                  ) : null}
                  <strong>{i + 1}.</strong> {entry.navn} ({entry.count})
                </Typography>
              </Tooltip>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );

  const statsCard = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* <FormControl sx={{ mb: 1 }}>
        <Select
          value={selectedStatSport}
          onChange={(e) => setSelectedStatSport(e.target.value)}
          size="small"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="tennis">Tennis</MenuItem>
          <MenuItem value="padel">Padel</MenuItem>
        </Select>
      </FormControl> */}

      {(selectedStatSport === "all" || selectedStatSport === "tennis") &&
        renderStatsSection("Top Tennis Members", tennisStats)}

      {(selectedStatSport === "all" || selectedStatSport === "padel") &&
        renderStatsSection("Top Padel Members", padelStats)}
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

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const aTime = new Date(a.startTs);
    const bTime = new Date(b.startTs);
    return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
  });

  const paginatedBookings = sortedBookings.slice(
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
                {[7, 14, 30, 60].map((val) => (
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
            <FormControl sx={{ minWidth: 140 }}>
              <Select
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value)}
                displayEmpty
              >
                <MenuItem value="asc">Oldest → Newest</MenuItem>
                <MenuItem value="desc">Newest → Oldest</MenuItem>
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
                  height: 188,
                  p: 2,
                  overflow: "hidden",
                  borderRadius: 2,
                  boxShadow: 3,
                  backgroundColor: "background.paper",
                }}
                elevation={3}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    mb={0.5}
                  >
                    {b.resources[0]?.name?.toLowerCase().includes("tennis") ? (
                      <SportsTennisIcon fontSize="small" color="success" />
                    ) : b.resources[0]?.name
                        ?.toLowerCase()
                        .includes("padel") ? (
                      <SportsTennisOutlinedIcon
                        fontSize="small"
                        color="primary"
                      />
                    ) : null}
                    <Typography variant="subtitle1" fontWeight="bold">
                      {b.resources[0]?.name}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {formatTime(b.startTs)} - {formatTime(b.endTs)}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {b.infoText || null}
                  </Typography>

                  <Box mt={1} sx={{ flexGrow: 1, overflowY: "auto" }}>
                    {b.bookings.length > 0 ? (
                      b.bookings.map((bk) => {
                        const member = members.find(
                          (m) =>
                            m.bookingId?.toLowerCase() ===
                            bk.accountId?.toLowerCase()
                        );
                        return (
                          <Typography
                            key={bk.id}
                            variant="body2"
                            color={member ? "text.primary" : "error"}
                            noWrap
                          >
                            • {member?.navn || "Unknown"}
                          </Typography>
                        );
                      })
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No members
                      </Typography>
                    )}
                  </Box>
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
