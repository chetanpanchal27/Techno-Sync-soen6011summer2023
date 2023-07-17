import React from "react";
import NavBar from "./NavBar";
import { Grid } from "@material-ui/core";

const HomePage = (props) => {
  return (
    <Grid>
      <Grid item>
        <NavBar />
      </Grid>
    </Grid>
  );
};

export default HomePage;
