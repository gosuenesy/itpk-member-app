import React, { useState, useMemo } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { StaticDatePicker, PickersDay } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/da";
import localeData from "dayjs/plugin/localeData";
import isoWeek from "dayjs/plugin/isoWeek";
import { green } from "@mui/material/colors";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

dayjs.extend(localeData);
dayjs.extend(isoWeek);
dayjs.locale("da");

const getUtilizationMap = (bookings) => {
  const dayData = {};

  bookings.forEach((b) => {
    const day = dayjs(b.startTs).format("YYYY-MM-DD");
    if (!dayData[day]) {
      dayData[day] = { count: 0 };
    }
    dayData[day].count += 1;
  });

  const map = {};
  Object.entries(dayData).forEach(([day, { count }]) => {
    const totalMinutes = count * 60;
    const percent = Math.min(totalMinutes / 840, 1); // 14 hours = 840 minutes
    map[day] = { percent, count };
  });

  return map;
};

const getColorFromUtilization = (percent) => {
  if (percent >= 0.875) return green[800];
  if (percent >= 0.75) return green[700];
  if (percent >= 0.625) return green[600];
  if (percent >= 0.5) return green[500];
  if (percent >= 0.375) return green[400];
  if (percent >= 0.25) return green[300];
  if (percent >= 0.125) return green[200];
  return green[100];
};

const BookingCalendar = ({ bookings }) => {
  const [selectedSport, setSelectedSport] = useState("Padel");

  const filteredBookings = useMemo(() => {
    const sport = selectedSport.toLowerCase();

    return bookings.filter((b) => {
      const resourceNames = b.resources?.map((r) => r.name.toLowerCase()) || [];
      return resourceNames.some((name) => name.includes(sport));
    });
  }, [bookings, selectedSport]);

  const utilizationMap = useMemo(
    () => getUtilizationMap(filteredBookings),
    [filteredBookings]
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <ToggleButtonGroup
          value={selectedSport}
          exclusive
          onChange={(e, newValue) => {
            if (newValue !== null) setSelectedSport(newValue);
          }}
          size="small"
        >
          <ToggleButton value="Padel">Padel</ToggleButton>
          <ToggleButton value="Tennis">Tennis</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {filteredBookings.length === 0 ? (
        <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
          No bookings found for {selectedSport}.
        </Typography>
      ) : null}

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="da">
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          dayOfWeekFormatter={(day) =>
            ["Sø", "Ma", "Ti", "On", "To", "Fr", "Lø"][day.isoWeekday() % 7]
          }
          openTo="day"
          value={dayjs()}
          readOnly
          showToolbar={false}
          onChange={() => {}}
          slots={{
            textField: () => null,
            day: (props) => {
              const dateKey = props.day.format("YYYY-MM-DD");
              const usage = utilizationMap[dateKey];
              const bg = usage
                ? getColorFromUtilization(usage.percent)
                : "transparent";
              const isLight = [
                green[100],
                green[200],
                green[300],
                green[400],
                green[500],
              ].includes(bg);

              const percentText = usage
                ? `${Math.round(usage.percent * 100)}% booked`
                : "";
              const countText = usage
                ? `${usage.count} booking${usage.count !== 1 ? "s" : ""}`
                : "";
              const tooltipText = usage ? `${percentText} — ${countText}` : "";

              return (
                <Tooltip title={tooltipText} arrow disableInteractive>
                  <Box>
                    <PickersDay
                      {...props}
                      sx={{
                        backgroundColor: bg,
                        borderRadius: 2,
                        color: `${isLight ? "#000" : "#fff"} !important`,
                        "&.Mui-selected": {
                          backgroundColor: bg,
                          color: `${isLight ? "#000" : "#fff"} !important`,
                        },
                        "&.MuiPickersDay-today": {
                          border: "none",
                        },
                      }}
                    />
                  </Box>
                </Tooltip>
              );
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default BookingCalendar;
