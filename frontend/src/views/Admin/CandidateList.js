import { useState, useEffect, useContext } from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import axios from "axios";
import { PopupContext } from "../../App";
import apiList from "../../Helper/Apis";
import CandidateTable from "../../Helper/CandidateTable";
import NavBar from "../NavBar";

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

function CandidateList(props) {
  const [candidateList, setCandidateList] = useState([]);

  const styles = useStyles();
  const setPopup = useContext(PopupContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const address = apiList.candidates;
    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setCandidateList(response.data);
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
  const handleDelete = (userIds) => {
    console.log("Ids ", userIds);

    const address = apiList.candidates;
    axios
      .delete(`${address}/${userIds}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(async (response) => {
        console.log(response.data.message);
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        await getData();
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
              Candidate List
            </Typography>
          </Grid>
        </Grid>

        {candidateList.length > 0 ? (
          <Grid container>
            <CandidateTable
              candidateList={candidateList}
              handleDelete={handleDelete}
            />
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
            No Candidate Found
          </Typography>
        )}
      </Grid>
    </>
  );
}
export default CandidateList;
