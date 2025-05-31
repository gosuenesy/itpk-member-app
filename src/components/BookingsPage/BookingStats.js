import React from "react";
import { Box, Card, Typography, Stack, Tooltip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const BookingStats = ({ stats }) => {
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
                  {i < 1 && (
                    <EmojiEventsIcon
                      color="warning"
                      fontSize="small"
                      sx={{ verticalAlign: "middle", mr: 0.5 }}
                    />
                  )}
                  <strong>{i + 1}.</strong> {entry.navn} ({entry.count})
                </Typography>
              </Tooltip>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {renderStatsSection("Top Tennis Members", stats.tennis)}
      {renderStatsSection("Top Padel Members", stats.padel)}
    </Box>
  );
};

export default BookingStats;
