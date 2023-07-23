import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  makeStyles,
  Paper,
  Typography,
  Modal,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";

import { PopupContext } from "../App";

import apiList from "../Helper/Apis";
import NavBar from "./NavBar";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  statusBlock: {
    width: "120%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
    minHeight: "95%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const ApplicationTile = (props) => {
  const styles = useStyles();
  const { application } = props;
  const setPopup = useContext(PopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.job.rating);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const fetchRating = () => {
    axios
      .get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setRating(response.data.rating);
        console.log(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, jobId: application.job._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setPopup({
          open: true,
          severity: "success",
          message: "Rating updated successfully",
        });
        fetchRating();
        setOpen(false);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        fetchRating();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#0a8d24",
    accepted: "#0a8d24",
    rejected: "#e80f0f",
    deleted: "#d82828",
    cancelled: "#e32828",
    finished: "#e32828",
  };
  return (
    <Paper className={styles.jobTileOuter} elevation={3}>
      <Grid container>
        <Grid container item xs={8} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{application.job.title}</Typography>
          </Grid>
          <Grid item>Posted By: {application.recruiter.name}</Grid>
          <Grid item>Role : {application.job.jobType}</Grid>
          <Grid item>Salary : &#8377; {application.job.salary} per month</Grid>
          <Grid item>
            Duration :{" "}
            {application.job.duration !== 0
              ? `${application.job.duration} month`
              : `Flexible`}
          </Grid>
          <Grid item>
            {application.job.skillsets.map((skill) => (
              <Chip label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
          <Grid item>Applied On: {appliedOn.toLocaleDateString()}</Grid>
          {application.status === "accepted" ||
          application.status === "finished" ? (
            <Grid item>Joined On: {joinedOn.toLocaleDateString()}</Grid>
          ) : null}
        </Grid>
        <Grid
          item
          container
          direction="column"
          xs={4}
          spacing={1}
          justifyContent="center"
        >
          <Grid item>
            <Paper
              className={styles.statusBlock}
              style={{
                background: colorSet[application.status],
                color: "#ffffff",
                padding: "6px 1px",
              }}
            >
              {application.status}
            </Paper>
          </Grid>
          {application.status === "accepted" ||
          application.status === "finished" ? (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                className={styles.statusBlock}
                onClick={() => {
                  fetchRating();
                  setOpen(true);
                }}
              >
                Rate Job
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose} className={styles.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Rating
            name="simple-controlled"
            style={{ marginBottom: "30px" }}
            value={rating === -1 ? null : rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={() => changeRating()}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const UserAppliedJobs = (props) => {
  const setPopup = useContext(PopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <>
      <Grid>
        <NavBar />
      </Grid>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid item>
          <Typography
            variant="h2"
            style={{ color: "#817676", fontWeight: "bold" }}
          >
            Applications
          </Typography>
        </Grid>

        {/* <Grid
          container
          item
          xs
          direction="column"
          style={{ width: "100%" }}
          alignItems="stretch"
          justifyContent="center"
        >
          {applications.length > 0 ? (
            applications.map((obj) => (
              <Grid item>
                <ApplicationTile application={obj} />
              </Grid>
            ))
          ) : (
            <Typography
              variant="h5"
              style={{
                height: "50px",
                textAlign: "center",
                background: "rgba(255,255,255,0.5)",
                marginLeft: "25%",
                marginRight: "25%",
                paddingTop: "15px",
              }}
            >
              No Job Applied
            </Typography>
          )}
        </Grid> */}
        <Grid container>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              {applications.length > 0 ? (
                applications.map((application) => {
                  return (
                    <Grid item>
                      <ApplicationTile
                        application={application}
                        getData={getData}
                      />
                    </Grid>
                  );
                })
              ) : (
                <Typography
                  variant="h5"
                  style={{
                    height: "50px",
                    textAlign: "center",
                    background: "rgba(255,255,255,0.5)",
                    marginLeft: "25%",
                    marginRight: "25%",
                    paddingTop: "15px",
                  }}
                >
                  No Applicant found
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default UserAppliedJobs;
