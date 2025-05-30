import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";

import MemberList from "./components/MemberList";
import BookingsPage from "./components/BookingsPage";
import { useFilteredMembers } from "./components/useFilteredMembers";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

const Navigation = () => {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ITPK Admin
          </Typography>
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

function App() {
  const { filtered, tags, setMembers } = useFilteredMembers({
    selectedTag: "",
    searchName: "",
    searchCity: "",
    searchEmail: "",
    bookingFilter: "all",
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router basename="/itpk-member-app">
        <Navigation />
        <Routes>
          <Route path="/" element={<MemberList members={filtered} />} />
          <Route path="/members" element={<MemberList members={filtered} />} />
          <Route
            path="/bookings"
            element={<BookingsPage members={filtered} />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
