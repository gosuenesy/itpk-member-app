import React from "react";
import { Grid, Container } from "@mui/material";
import MemberCard from "./MemberCard";

const MemberGrid = ({ members }) => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Grid
      container
      spacing={3}
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "24px",
      }}
    >
      {members.map((member, i) => (
        <MemberCard key={i} member={member} />
      ))}
    </Grid>
  </Container>
);

export default MemberGrid;
