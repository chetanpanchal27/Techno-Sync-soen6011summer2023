import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Modal,
  Paper,
  makeStyles,
  TextField,
  Avatar,
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";
import FileInput from "../Helper/FileInput";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";

import { PopupContext } from "../App";
import apiList from "../Helper/Apis";
import NavBar from "./NavBar";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // padding: "30px",
  },
  avatar: {
    alignSelf: "center",
    width: theme.spacing(17),
    height: theme.spacing(17),
  },
}));

const MultifieldInput = (props) => {
  const styles = useStyles();
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <Grid item container className={styles.inputBox} key={key}>
          <Grid item xs={6}>
            <TextField
              label={`Institution Name #${key + 1}`}
              value={education[key].institutionName}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].institutionName = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Start Year"
              value={obj.startYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].startYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="End Year"
              value={obj.endYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].endYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
        </Grid>
      ))}
      <Grid item style={{ alignSelf: "center" }}>
        <Button
          variant="contained"
          style={{ background: "#817676", color: "white" }}
          onClick={() =>
            setEducation([
              ...education,
              {
                institutionName: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
          className={styles.inputBox}
        >
          Add another institution details
        </Button>
      </Grid>
    </>
  );
};

const UserProfile = (props) => {
  const styles = useStyles();
  const setPopup = useContext(PopupContext);
  const [userData, setUserData] = useState();
  const [open, setOpen] = useState(false);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
  });

  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileDetails(response.data);
        if (response.data.education.length > 0) {
          setEducation(
            response.data.education.map((edu) => ({
              institutionName: edu.institutionName ? edu.institutionName : "",
              startYear: edu.startYear ? edu.startYear : "",
              endYear: edu.endYear ? edu.endYear : "",
            }))
          );
        }
      })
      .catch((err) => {
        //console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const getResume = () => {
    const filename = `${profileDetails.resume}`;
    console.log("file namee ", filename);
    console.log(filename);
    if (filename !== "") {
      window.open(
        `${apiList.downloadResume}/${encodeURIComponent(filename)}`,
        "_blank"
      );
      // axios
      //   .get(`${apiList.downloadResume}/${filename}`)
      //   .then((response) => {
      //     console.log(response);
      //   })
      //   .catch((err) => {
      //     console.log("Error ", err);
      //     setPopup({
      //       open: true,
      //       severity: "error",
      //       message: err.response.data,
      //     });
      //   });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "You have not uploaded any resume. Upload one to view!",
      });
    }

    // axios(address, {
    //   method: "GET",
    //   responseType: "blob",
    // })
    //   .then((response) => {
    //     const file = new Blob([response.data], { type: "application/pdf" });
    //     const fileURL = URL.createObjectURL(file);
    //     window.open(fileURL);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     setPopup({
    //       open: true,
    //       severity: "error",
    //       message: "You have not uploaded any resume. Upload one to view!",
    //     });
    //   });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const editDetails = () => {
    setOpen(true);
  };

  const handleUpdate = () => {
    console.log(education);

    let updatedDetails = {
      ...profileDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
    };

    axios
      .put(apiList.user, updatedDetails, {
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
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
    setOpen(false);
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
        <Grid item xs>
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
            <Grid container direction="column" alignItems="center" xs={2}>
              <Avatar
                src={`${profileDetails.profile}`}
                className={styles.avatar}
              />
              <Typography
                variant="h3"
                component="h2"
                style={{ color: "#3f51b5", fontWeight: "bold" }}
              >
                Profile
              </Typography>
            </Grid>
            <Grid container direction="column" alignItems="" spacing={3}>
              {/* <Grid item >
              
            </Grid> */}

              <Grid item>
                <TextField
                  label="Name"
                  value={profileDetails.name}
                  onChange={(event) => handleInput("name", event.target.value)}
                  className={styles.inputBox}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <MultifieldInput
                education={education}
                setEducation={setEducation}
              />
              <Grid item>
                <ChipInput
                  className={styles.inputBox}
                  label="Skills"
                  variant="outlined"
                  helperText="Press enter to add skills"
                  value={profileDetails.skills}
                  onAdd={(chip) =>
                    setProfileDetails({
                      ...profileDetails,
                      skills: [...profileDetails.skills, chip],
                    })
                  }
                  onDelete={(chip, index) => {
                    let skills = profileDetails.skills;
                    skills.splice(index, 1);
                    setProfileDetails({
                      ...profileDetails,
                      skills: skills,
                    });
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <FileInput
                  className={styles.inputBox}
                  label="Resume (Images only)"
                  icon={<DescriptionIcon />}
                  uploadTo={apiList.uploadResume}
                  handleInput={handleInput}
                  identifier={"resume"}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  className={styles.statusBlock}
                  color="primary"
                  onClick={() => getResume()}
                  style={{ alignItems: "center" }}
                >
                  View Uploaded Resume
                </Button>
              </Grid>
              <Grid item>
                <FileInput
                  className={styles.inputBox}
                  label="Profile Photo (.jpg/.png)"
                  icon={<FaceIcon />}
                  uploadTo={apiList.uploadProfileImage}
                  handleInput={handleInput}
                  identifier={"profile"}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              style={{
                padding: "10px 50px",
                marginTop: "30px",
                borderRadius: "8px",
                height: "50px",
              }}
              onClick={() => handleUpdate()}
            >
              Update Details
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default UserProfile;
