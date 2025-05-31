import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsTennisOutlinedIcon from "@mui/icons-material/SportsTennisOutlined";
import dayjs from "dayjs";

const formatTime = (ts) => dayjs(ts).format("DD.MM.YYYY HH:mm");

const BookingCard = ({ booking, members }) => {
  const resourceName = booking.resources?.[0]?.name?.toLowerCase() || "";

  const SportIcon = resourceName.includes("tennis")
    ? <SportsTennisIcon fontSize="small" color="success" />
    : resourceName.includes("padel")
    ? <SportsTennisOutlinedIcon fontSize="small" color="primary" />
    : null;

  return (
    <Card
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
    >
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          {SportIcon}
          <Typography variant="subtitle1" fontWeight="bold">
            {booking.resources[0]?.name}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <AccessTimeIcon fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {formatTime(booking.startTs)} - {formatTime(booking.endTs)}
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
          {booking.infoText || null}
        </Typography>

        <Box mt={1} sx={{ flexGrow: 1, overflowY: "auto" }}>
          {booking.bookings.length > 0 ? (
            booking.bookings.map((bk) => {
              const member = members.find(
                (m) => m.bookingId?.toLowerCase() === bk.accountId?.toLowerCase()
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
  );
};

export default BookingCard;
