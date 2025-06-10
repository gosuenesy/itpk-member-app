import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

import MemberList from "./components/MemberPage/MemberList";
import BookingsPage from "./components/BookingsPage/BookingsPage";
import { useFilteredMembers } from "./components/useFilteredMembers";
import NavBar from "./components/NavBar";

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

function App() {
  const { filtered } = useFilteredMembers({
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
        <NavBar />
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
