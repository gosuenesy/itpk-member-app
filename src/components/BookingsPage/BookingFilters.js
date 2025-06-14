import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Typography,
  Switch,
  Stack,
  InputLabel,
} from "@mui/material";

const BookingFilters = ({
  daysAgo,
  setDaysAgo,
  dayCount,
  setDayCount,
  showOnlySingles,
  setShowOnlySingles,
  sportFilter,
  setSportFilter,
  sortDirection,
  setSortDirection,
}) => (
  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
    <FormControl fullWidth size="small">
      <InputLabel>From</InputLabel>
      <Select
        value={daysAgo}
        onChange={(e) => setDaysAgo(e.target.value)}
        label="From"
      >
        {[0, 30, 60].map((val) => (
          <MenuItem key={val} value={val}>
            {val} days ago
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel>Next</InputLabel>
      <Select
        value={dayCount}
        onChange={(e) => setDayCount(e.target.value)}
        label="Next"
      >
        {[7, 14, 30, 60].map((val) => (
          <MenuItem key={val} value={val}>
            {val} days
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl fullWidth sx={{ flexDirection: "row", alignItems: "center" }}>
      <Typography variant="body2" sx={{ mr: 1 }}>
        1 Member
      </Typography>
      <Switch
        checked={showOnlySingles}
        onChange={(e) => setShowOnlySingles(e.target.checked)}
      />
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel>Sport</InputLabel>
      <Select
        value={sportFilter}
        onChange={(e) => setSportFilter(e.target.value)}
        label="Sport"
        displayEmpty
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="tennis">Tennis</MenuItem>
        <MenuItem value="padel">Padel</MenuItem>
      </Select>
    </FormControl>

    <FormControl fullWidth size="small">
      <InputLabel>Sort</InputLabel>
      <Select
        value={sortDirection}
        onChange={(e) => setSortDirection(e.target.value)}
        label="Sort"
        displayEmpty
      >
        <MenuItem value="asc">Oldest → Newest</MenuItem>
        <MenuItem value="desc">Newest → Oldest</MenuItem>
      </Select>
    </FormControl>
  </Stack>
);

export default BookingFilters;
