import React from "react";
import { Card, Typography, Avatar, Box, Stack, Chip } from "@mui/material";
import { Male, Female, Person } from "@mui/icons-material";

const MemberCard = ({ member }) => {
  const {
    navn,
    adresse1,
    postnr,
    postnr_by,
    mobil,
    email,
    birth,
    individuel1,
    individuel4,
    koen,
    hasBookingAccount,
    onlyBooking,
  } = member;

  const renderAvatarIcon = () => {
    if (koen === "mand") return <Male />;
    if (koen === "kvinde") return <Female />;
    return <Person />;
  };

  const renderBookingChip = () => {
    if (onlyBooking) {
      return (
        <Chip
          label="Booking without Conventus"
          color="warning"
          size="small"
          sx={{ mb: 0.5 }}
        />
      );
    }

    if (hasBookingAccount) {
      return (
        <Chip
          label="Booking"
          color="success"
          size="small"
          sx={{ mb: 0.5 }}
        />
      );
    }

    return (
      <Chip
        label="No Booking"
        color="error"
        size="small"
        sx={{ mb: 0.5 }}
      />
    );
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        p: 2,
      }}
      elevation={3}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Avatar>{renderAvatarIcon()}</Avatar>
        <Box>
          <Typography variant="h6">{navn}</Typography>
          {renderBookingChip()}
          {email && <Typography variant="body2">{email}</Typography>}
        </Box>
      </Box>

      <Stack spacing={0.2}>
        {adresse1 && (
          <Typography variant="body2">
            {adresse1}, {postnr} {postnr_by}
          </Typography>
        )}
        {mobil && (
          <Typography variant="body2">
            <strong>Phone:</strong> {mobil}
          </Typography>
        )}
        {birth && (
          <Typography variant="body2">
            <strong>Birth Date:</strong> {birth}
          </Typography>
        )}
      </Stack>

      {(individuel1 || individuel4) && (
        <Box mt={2}>
          {individuel1 && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Type: {individuel1}
            </Typography>
          )}
          {individuel4 && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Sport: {individuel4}
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
};

export default MemberCard;
