import React from "react";
import { Box, Pagination } from "@mui/material";

const PaginationControls = ({ count, page, setPage }) => (
  <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
    <Pagination
      count={count}
      page={page}
      onChange={(e, val) => setPage(val)}
      color="primary"
    />
  </Box>
);

export default PaginationControls;
