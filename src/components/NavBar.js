import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Box
              component="img"
              src="/itpk-member-app/ITPKlogo.png"
              alt="ITPK Logo"
              sx={{ height: 32, mr: 1, filter: "invert(1)" }}
            />
            <Typography variant="h6" noWrap>
              ITPK Admin
            </Typography>
          </Box>

          <Box>
            <Button
              component={Link}
              to="/members"
              color="inherit"
              variant={location.pathname === "/members" ? "outlined" : "text"}
              sx={{ mx: 1 }}
            >
              Members
            </Button>
            <Button
              component={Link}
              to="/bookings"
              color="inherit"
              variant={location.pathname === "/bookings" ? "outlined" : "text"}
              sx={{ mx: 1 }}
            >
              Bookings
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
