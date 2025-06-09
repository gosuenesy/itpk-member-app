import React from "react";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { Box, Tooltip } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { green } from "@mui/material/colors";
import { PickersDay } from "@mui/x-date-pickers";

const getUtilizationMap = (bookings) => {
  const dayData = {};

  bookings.forEach((b) => {
    const day = dayjs(b.startTs).format("YYYY-MM-DD");
    const start = dayjs(b.startTs);
    const end = dayjs(b.endTs);
    const minutes = end.diff(start, "minute");

    if (!dayData[day]) {
      dayData[day] = { totalMinutes: 0, count: 0 };
    }

    dayData[day].totalMinutes += minutes;
    dayData[day].count += 1;
  });

  const map = {};
  Object.entries(dayData).forEach(([day, { totalMinutes, count }]) => {
    const percent = Math.min(totalMinutes / 840, 1); // assume 14h = 840 min
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
  const utilizationMap = getUtilizationMap(bookings);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        openTo="day"
        value={dayjs()}
        readOnly
        showToolbar={false}
        onChange={() => {}} // required to suppress warnings
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
        dayOfWeekFormatter={(day) => day.format("dd").charAt(0)}
      />
    </LocalizationProvider>
  );
};

export default BookingCalendar;
