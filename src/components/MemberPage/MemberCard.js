import React, { useState } from "react";
import {
  Card,
  Typography,
  Avatar,
  Box,
  Stack,
  Chip,
  Divider,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Male,
  Female,
  Person,
  Email,
  Home,
  Phone,
  CalendarToday,
  Groups,
  Group,
  Badge,
  SportsTennis,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

const MemberCard = ({ member }) => {
  const [expanded, setExpanded] = useState(false);
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
    createdTs,
    groupName,
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
          icon={<Group />}
          label="Booking Only"
          color="warning"
          size="small"
        />
      );
    }
    if (hasBookingAccount) {
      return (
        <Chip icon={<Group />} label="Booking" color="success" size="small" />
      );
    }
    return (
      <Chip icon={<Group />} label="No Booking" color="error" size="small" />
    );
  };

  const calculateAge = (birthDateString) => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "background.paper",
      }}
      elevation={3}
    >
      <Box sx={{ mb: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar>{renderAvatarIcon()}</Avatar>
            <Typography variant="h6">{navn}</Typography>
          </Stack>
          <IconButton onClick={() => setExpanded((prev) => !prev)} size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Box mt={1} pt={0.5}>
          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="flex-start"
            alignItems="center"
            flexWrap="wrap"
          >
            {renderBookingChip()}

            {individuel1 && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Badge sx={{ fontSize: 16 }} />
                <Typography
                  sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                >
                  {individuel1}
                </Typography>
              </Stack>
            )}
            {individuel4 && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <SportsTennis sx={{ fontSize: 16 }} />
                <Typography
                  sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                >
                  {individuel4}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ mb: 1, mt: 1 }} />
        <Stack spacing={0.8}>
          {email && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Email sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: "0.8rem" }}>{email}</Typography>
            </Stack>
          )}
          {adresse1 && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Home sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: "0.8rem" }}>
                {adresse1}, {postnr} {postnr_by}
              </Typography>
            </Stack>
          )}
          {mobil && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Phone sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: "0.8rem" }}>{mobil}</Typography>
            </Stack>
          )}
          {birth && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarToday sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: "0.8rem" }}>
                {new Date(birth).toLocaleDateString("da-DK")} (
                {calculateAge(birth)} år)
              </Typography>
            </Stack>
          )}
          {createdTs && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Group sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: "0.8rem" }}>
                {new Date(createdTs).toLocaleDateString("da-DK")}{" "}
                {"(Booking Creation)"}
              </Typography>
            </Stack>
          )}
          {groupName && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Groups sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: "0.8rem" }}>{groupName}</Typography>
            </Stack>
          )}
        </Stack>
      </Collapse>
    </Card>
  );
};

export default MemberCard;
