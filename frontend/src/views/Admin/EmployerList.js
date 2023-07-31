import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { PopupContext } from "../../App";

import apiList from "../../Helper/Apis";
import getToken, { getUserType } from "../../Helper/Auth";
import NavBar from "../../views/NavBar";
import EmployerTable from "../../Helper/EmployerTable";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  button: {
    width: "100%",
    height: "15%",
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
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
}));

const JobTile = (props) => {
  const { employer } = props;
  const setPopup = useContext(PopupContext);

  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");
  const styles = useStyles();

  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  const handleApply = () => {
    // console.log(job._id);
    // console.log(sop);
    // axios
    //   .post(
    //     `${apiList.jobs}/${job._id}/applications`,
    //     {
    //       sop: sop,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     setPopup({
    //       open: true,
    //       severity: "success",
    //       message: response.data.message,
    //     });
    //     handleClose();
    //   })
    //   .catch((err) => {
    //     console.log(err.response);
    //     setPopup({
    //       open: true,
    //       severity: "error",
    //       message: err.response.data.message,
    //     });
    //     handleClose();
    //   });
  };

  return (
    <Paper className={styles.jobTileOuter} elevation={3}>
      <Grid container justifyContent="center">
        <Grid container item xs={10} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{employer.name}</Typography>
          </Grid>
          <Grid item>
            ActiveApplication : {employer.totalActiveApplications}
          </Grid>
          <Grid item>
            AccptedCandidates : {employer.totalAcceptedCandidates}
          </Grid>

          <Grid item>Total Job Posted : {employer.totalPost}</Grid>
          <Grid item>ContactNumber : {employer.contactNumber}</Grid>
        </Grid>
        <Grid container alignItems="center" item xs={2}>
          {getUserType() === "applicant" && (
            <Button
              variant="contained"
              style={{ background: "#7e7272", color: "white" }}
              className={styles.button}
              onClick={() => {
                setOpen(true);
              }}
            >
              Apply
            </Button>
          )}
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
            minWidth: "50%",
            alignItems: "center",
          }}
        >
          <TextField
            label="Write SOP (upto 250 words)"
            multiline
            rows={8}
            style={{ width: "100%", marginBottom: "30px" }}
            variant="outlined"
            value={sop}
            onChange={(event) => {
              if (
                event.target.value.split(" ").filter(function (n) {
                  return n != "";
                }).length <= 250
              ) {
                setSop(event.target.value);
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={() => handleApply()}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const EmployerList = (props) => {
  const [employerList, setEmployerList] = useState([]);

  const styles = useStyles();
  const setPopup = useContext(PopupContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let address = apiList.employers;
    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setEmployerList(response.data);
      })
      .catch((err) => {
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
        direction="column"
        alignItems="center"
        style={{ minHeight: "93vh", padding: "30px" }}
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs>
            <Typography
              variant="h2"
              style={{ color: "#817676", fontWeight: "bold" }}
            >
              Employer List
            </Typography>
          </Grid>
        </Grid>

        {/* <Grid container className={styles.root}>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              {employerList.length > 0 ? (
                employerList.map((employer) => {
                  return (
                    <Grid item>
                      <JobTile employer={employer} />
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
                  No jobs found
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid> */}
        {employerList.length > 0 ? (
          <Grid container>
            <EmployerTable employerList={employerList} />
          </Grid>
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
            No Recruiter Found
          </Typography>
        )}
      </Grid>
    </>
  );
};
export default EmployerList;
