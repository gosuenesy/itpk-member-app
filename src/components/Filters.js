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
  selectedGroup,
  setSelectedGroup,
  groups,
  bookingYear,
  setBookingYear,
}) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 2017 + 1 },
    (_, i) => 2017 + i
  );

  return (
    <Stack spacing={2} sx={{ mb: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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

        {selectedGroup !== undefined && setSelectedGroup && (
          <FormControl size="small" fullWidth>
            <InputLabel>Group Filter</InputLabel>
            <Select
              value={selectedGroup}
              label="Group Filter"
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {groups?.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {bookingYear !== undefined && setBookingYear && (
          <FormControl size="small" fullWidth>
            <InputLabel>Booking Creation Year</InputLabel>
            <Select
              value={bookingYear}
              label="Booking Creation Year"
              onChange={(e) => setBookingYear(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {Array.from(
                { length: new Date().getFullYear() - 2017 + 1 },
                (_, i) => (
                  <MenuItem key={2017 + i} value={(2017 + i).toString()}>
                    {2017 + i}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        )}
      </Stack>
    </Stack>
  );
};

export default Filters;
