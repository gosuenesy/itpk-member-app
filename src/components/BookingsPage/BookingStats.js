import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Collapse,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const BookingStats = ({ stats }) => {
  const [openTennis, setOpenTennis] = useState(false);
  const [openPadel, setOpenPadel] = useState(false);

  const renderStatsSection = (title, data, isOpen, setOpen) => (
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          mb: 1,
        }}
        onClick={() => setOpen(!isOpen)}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton size="small" onClick={() => setOpen(!isOpen)}>
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
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
      </Collapse>
    </Card>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {renderStatsSection(
        "Top Tennis Members",
        stats.tennis,
        openTennis,
        setOpenTennis
      )}
      {renderStatsSection(
        "Top Padel Members",
        stats.padel,
        openPadel,
        setOpenPadel
      )}
    </Box>
  );
};

export default BookingStats;
