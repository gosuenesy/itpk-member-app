import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Pagination,
  Stack,
  Box,
  Container,
} from "@mui/material";
import MemberCard from "./MemberCard";
import stringSimilarity from "string-similarity";

const ITEMS_PER_PAGE = 12;

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [page, setPage] = useState(1);
  const [bookingFilter, setBookingFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://itpk-member-app.onrender.com/api/members"
        );
        const data = await res.json();
        const conventusList = data.conventus?.medlemmer?.medlem || [];

        const bookingRes = await fetch(
          "https://itpk-member-app.onrender.com/api/booking-members"
        );
        const bookingList = await bookingRes.json();

        const bookingNames = bookingList.map((b) =>
          `${b.firstName} ${b.lastName}`.toLowerCase().trim()
        );
        const bookingEmails = bookingList.map((b) =>
          b.email?.toLowerCase().trim()
        );

        const matchedBookingIndices = new Set();

        const enriched = conventusList.map((m) => {
          const name = m.navn?.toLowerCase().trim();
          const email = m.email?.toLowerCase().trim();

          const nameMatch = stringSimilarity.findBestMatch(name, bookingNames);
          const emailMatch = stringSimilarity.findBestMatch(
            email,
            bookingEmails
          );

          const nameRating = nameMatch.bestMatch.rating;
          const emailRating = emailMatch.bestMatch.rating;

          const hasBookingAccount = nameRating > 0.85 || emailRating > 0.9;

          if (nameRating > 0.85)
            matchedBookingIndices.add(nameMatch.bestMatchIndex);
          if (emailRating > 0.9)
            matchedBookingIndices.add(emailMatch.bestMatchIndex);

          return { ...m, hasBookingAccount, onlyBooking: false };
        });

        const bookingOnly = bookingList
          .map((b, index) => ({ ...b, id: `booking-${index}` }))
          .filter((_, index) => !matchedBookingIndices.has(index))
          .map((b) => ({
            navn: `${b.firstName} ${b.lastName}`,
            email: b.email || "",
            postnr_by: b.city || "",
            individuel1: "",
            hasBookingAccount: true,
            onlyBooking: true,
          }));

        const combined = [...enriched, ...bookingOnly];

        const allTags = Array.from(
          new Set(combined.map((m) => m.individuel1).filter(Boolean))
        );

        setTags(allTags);
        setMembers(combined);
        setFiltered(combined);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...members];

    if (selectedTag) {
      result = result.filter((m) => m.individuel1 === selectedTag);
    }

    if (searchName) {
      result = result.filter((m) =>
        m.navn.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchCity) {
      result = result.filter((m) =>
        m.postnr_by.toLowerCase().includes(searchCity.toLowerCase())
      );
    }

    if (searchEmail) {
      result = result.filter((m) =>
        m.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }

    if (bookingFilter === "with") {
      result = result.filter((m) => m.hasBookingAccount && !m.onlyBooking);
    } else if (bookingFilter === "without") {
      result = result.filter((m) => !m.hasBookingAccount);
    } else if (bookingFilter === "only") {
      result = result.filter((m) => m.onlyBooking);
    }

    setFiltered(result);
    setPage(1);
  }, [
    selectedTag,
    searchName,
    searchCity,
    searchEmail,
    members,
    bookingFilter,
  ]);

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
      <Typography variant="h4" gutterBottom>
        ITPK Members
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Member Count: {filtered.length}
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search Name"
          variant="outlined"
          size="small"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Search City"
          variant="outlined"
          size="small"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          fullWidth
        />
        <TextField
          label="Search Email"
          variant="outlined"
          size="small"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          fullWidth
        />
        <FormControl size="small" fullWidth>
          <InputLabel>Tag Filter</InputLabel>
          <Select
            value={selectedTag}
            label="Tag Filter"
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {tags.map((tag) => (
              <MenuItem key={tag} value={tag}>
                {tag}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" fullWidth>
          <InputLabel>Booking Filter</InputLabel>
          <Select
            value={bookingFilter}
            label="Booking Filter"
            onChange={(e) => setBookingFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="with">With Booking</MenuItem>
            <MenuItem value="without">Without Booking</MenuItem>
            <MenuItem value="only">Booking Without Conventus</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid
          container
          spacing={3}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          {paginated.map((member, i) => (
            <MemberCard key={i} member={member} />
          ))}
        </Grid>
      </Container>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(filtered.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={(e, val) => setPage(val)}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default MemberList;
