import React from "react";
import { Grid, Container } from "@mui/material";
import MemberCard from "./MemberCard";

const MemberGrid = ({ members }) => (
  <Container maxWidth="lg" sx={{ py: 2 }}>
    <Grid
      container
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: 3,
        gridAutoRows: "auto", 
        alignItems: "start", 
      }}
    >
      {members.map((member, i) => (
        <MemberCard key={i} member={member} />
      ))}
    </Grid>
  </Container>
);

export default MemberGrid;
