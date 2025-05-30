import React from "react";
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Stack,
} from "@mui/material";

const Filters = ({
  searchName,
  setSearchName,
  searchCity,
  setSearchCity,
  searchEmail,
  setSearchEmail,
  selectedTag,
  setSelectedTag,
  tags,
  bookingFilter,
  setBookingFilter,
}) => (
  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
    {searchName !== undefined && (
      <TextField
        label="Search Name"
        variant="outlined"
        size="small"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        fullWidth
      />
    )}

    {searchCity !== undefined && (
      <TextField
        label="Search City"
        variant="outlined"
        size="small"
        value={searchCity}
        onChange={(e) => setSearchCity(e.target.value)}
        fullWidth
      />
    )}

    {searchEmail !== undefined && (
      <TextField
        label="Search Email"
        variant="outlined"
        size="small"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        fullWidth
      />
    )}

    {selectedTag !== undefined && setSelectedTag && (
      <FormControl size="small" fullWidth>
        <InputLabel>Tag Filter</InputLabel>
        <Select
          value={selectedTag}
          label="Tag Filter"
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {tags?.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )}

    {bookingFilter !== undefined && setBookingFilter && (
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
    )}
  </Stack>
);

export default Filters;
