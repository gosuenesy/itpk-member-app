import React, { useState } from "react";
import { Typography, Container } from "@mui/material";
import Filters from "./Filters";
import MemberGrid from "./MemberGrid";
import PaginationControls from "./PaginationControls";
import { useFilteredMembers } from "./useFilteredMembers";

const ITEMS_PER_PAGE = 12;

const MemberList = () => {
  const [selectedTag, setSelectedTag] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { filtered, tags } = useFilteredMembers({
    selectedTag,
    searchName,
    searchCity,
    searchEmail,
    bookingFilter,
  });

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
      <Typography variant="h4" gutterBottom>
        ITPK Members
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Member Count: {filtered.length}
      </Typography>

      <Filters
        {...{
          searchName,
          setSearchName,
          searchCity,
          setSearchCity,
          searchEmail,
          setSearchEmail,
          selectedTag,
          setSelectedTag,
          tags,
          bookingFilter,
          setBookingFilter,
        }}
      />

      <MemberGrid members={paginated} />
      <PaginationControls
        count={Math.ceil(filtered.length / ITEMS_PER_PAGE)}
        page={page}
        setPage={setPage}
      />
    </Container>
  );
};

export default MemberList;
