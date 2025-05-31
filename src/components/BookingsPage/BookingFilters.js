import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Typography,
  Switch,
  Box,
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
  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
    <FormControl sx={{ minWidth: 140 }}>
      <Select value={daysAgo} onChange={(e) => setDaysAgo(e.target.value)}>
        {[0, 30, 60].map((val) => (
          <MenuItem key={val} value={val}>
            {val} days ago
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl sx={{ minWidth: 140 }}>
      <Select value={dayCount} onChange={(e) => setDayCount(e.target.value)}>
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
);

export default BookingFilters;
