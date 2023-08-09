import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Modal,
  Paper,
  makeStyles,
  TextField,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";

import { useNavigate } from "react-router-dom";
import { PopupContext } from "../../App";
import apiList from "../../Helper/Apis";
import NavBar from "../NavBar";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function AddJob(props) {
  const classes = useStyles();
  const setPopup = useContext(PopupContext);
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState({
    title: "",
    maxApplicants: 100,
    maxPositions: 30,
    deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 16),
    skillsets: [],
    jobType: "Full Time",
    duration: 0,
    salary: 0,
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    console.log(jobDetails);
    axios
      .post(apiList.jobs, jobDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        setJobDetails({
          title: "",
          maxApplicants: 100,
          maxPositions: 30,
          deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .substr(0, 16),
          skillsets: [],
          jobType: "Full Time",
          duration: 0,
          salary: 0,
        });
        navigate("/home");
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
  };

  return (
    <>
      <Grid>
        <NavBar />
      </Grid>
      <Grid
        container
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid item xs style={{ width: "50%" }}>
          <Paper
            style={{
              padding: "20px",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Typography
                  variant="h2"
                  style={{ color: "#3f51b5", fontWeight: "bold" }}
                >
                  Add Job
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  label="Title"
                  value={jobDetails.title}
                  onChange={(event) => handleInput("title", event.target.value)}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <ChipInput
                  className={classes.inputBox}
                  label="Skills"
                  variant="outlined"
                  helperText="Press enter to add skills"
                  value={jobDetails.skillsets}
                  onAdd={(chip) =>
                    setJobDetails({
                      ...jobDetails,
                      skillsets: [...jobDetails.skillsets, chip],
                    })
                  }
                  onDelete={(chip, index) => {
                    const { skillsets } = jobDetails;
                    skillsets.splice(index, 1);
                    setJobDetails({
                      ...jobDetails,
                      skillsets,
                    });
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  select
                  label="Job Type"
                  variant="outlined"
                  value={jobDetails.jobType}
                  onChange={(event) => {
                    handleInput("jobType", event.target.value);
                  }}
                  fullWidth
                >
                  <MenuItem value="Full Time">Full Time</MenuItem>
                  <MenuItem value="Part Time">Part Time</MenuItem>
                  <MenuItem value="Work From Home">Work From Home</MenuItem>
                </TextField>
              </Grid>
              <Grid item>
                <TextField
                  select
                  label="Duration"
                  variant="outlined"
                  value={jobDetails.duration}
                  onChange={(event) => {
                    handleInput("duration", event.target.value);
                  }}
                  fullWidth
                >
                  <MenuItem value={0}>Flexible</MenuItem>
                  <MenuItem value={1}>1 Month</MenuItem>
                  <MenuItem value={3}>3 Months</MenuItem>
                  <MenuItem value={6}>6 Months</MenuItem>
                  <MenuItem value={12}>1 Year</MenuItem>
                  <MenuItem value={24}>2 Years</MenuItem>
                </TextField>
              </Grid>
              <Grid item>
                <TextField
                  label="Salary"
                  type="number"
                  variant="outlined"
                  value={jobDetails.salary}
                  onChange={(event) => {
                    handleInput("salary", event.target.value);
                  }}
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Application Deadline"
                  type="datetime-local"
                  value={jobDetails.deadline}
                  onChange={(event) => {
                    handleInput("deadline", event.target.value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Maximum Number Of Applicants"
                  type="number"
                  variant="outlined"
                  value={jobDetails.maxApplicants}
                  onChange={(event) => {
                    handleInput("maxApplicants", event.target.value);
                  }}
                  InputProps={{ inputProps: { min: 1 } }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Positions Available"
                  type="number"
                  variant="outlined"
                  value={jobDetails.maxPositions}
                  onChange={(event) => {
                    handleInput("maxPositions", event.target.value);
                  }}
                  InputProps={{ inputProps: { min: 1 } }}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px", marginTop: "30px" }}
              onClick={() => handleUpdate()}
            >
              Post Job
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default AddJob;
