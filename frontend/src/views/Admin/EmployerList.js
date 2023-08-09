import { useState, useEffect, useContext } from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import axios from "axios";
import { PopupContext } from "../../App";
import apiList from "../../Helper/Apis";
import NavBar from "../NavBar";
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

function EmployerList(props) {
  const [employerList, setEmployerList] = useState([]);
  const [reload, setReload] = useState(false);
  const styles = useStyles();
  const setPopup = useContext(PopupContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const address = apiList.employers;
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

  const handleDelete = (userIds) => {
    console.log("Ids ", userIds);

    const address = apiList.employers;
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
        setReload(!reload);
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

        {employerList.length > 0 ? (
          <Grid container>
            <EmployerTable
              employerList={employerList}
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
            No Recruiter Found
          </Typography>
        )}
      </Grid>
    </>
  );
}
export default EmployerList;
