import { useState, useContext } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  makeStyles,
  Paper,
  MenuItem,
  Input,
} from "@material-ui/core";
import axios from "axios";
import { Navigate } from "react-router-dom";
import ChipInput from "material-ui-chip-input";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import FileInput from "../Helper/FileInput";
import { PopupContext } from "../App";

import apiList from "../Helper/Apis";
import getToken from "../Helper/Auth";

const useStyles = makeStyles((theme) => ({
  body: {
    padding: "30px 30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  inputBox: {
    width: "400px",
    marginTop: "18px",
  },
  submitButton: {
    width: "400px",
    marginTop: "5px",
  },
}));

const MultifieldInput = (props) => {
  const styles = useStyles();
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <Grid
          item
          container
          className={styles.inputBox}
          key={key}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
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
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
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

const SignupPage = (props) => {
  const styles = useStyles();
  const setPopup = useContext(PopupContext);

  const [isLoggedIn, setLoggedin] = useState(getToken());

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const [inputError, setinputError] = useState({
    email: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    password: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    name: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setinputError({
      ...inputError,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };
  const handleEmailError = (event) => {
    const email = event.target.value;
    if (email === "") {
      if (true) {
        handleInputError("email", true, "Email is required");
      }
    } else {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(event.target.value).toLowerCase())) {
        handleInputError("email", false, "");
      } else {
        handleInputError("email", true, "Incorrect email format");
      }
    }
  };

  const handlePasswordError = (event) => {
    if (event.target.value === "") {
      handleInputError("password", true, "Password is required");
    } else {
      handleInputError("password", false, "");
    }
  };

  const handleSingup = () => {
    const tmpErrorHandler = {};
    Object.keys(inputError).forEach((obj) => {
      if (inputError[obj].required && inputError[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputError[obj];
      }
    });

    console.log(education);

    let updatedDetails = {
      ...signupDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
    };

    setSignupDetails(updatedDetails);

    const isComplete = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    if (isComplete) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(getToken());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setinputError(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  const handleSingupRecruiter = () => {
    const tmpErrorHandler = {};
    Object.keys(inputError).forEach((obj) => {
      if (inputError[obj].required && inputError[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputError[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...signupDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...signupDetails,
        contactNumber: "",
      };
    }

    setSignupDetails(updatedDetails);

    const isComplete = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    console.log(updatedDetails);

    if (isComplete) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(getToken());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setinputError(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  return isLoggedIn ? (
    <Navigate to="/" />
  ) : (
    // <Paper elevation={3} className={styles.body}>
    <Grid container spacing={4}>
      <Grid item sm={12} md={6} className={styles.body}>
        <img
          src="https://cdn.pixabay.com/photo/2015/06/10/07/03/building-804526_1280.jpg"
          // src="./assets/images/home.jpg"
          width={500}
          height={500}
          style={{ borderRadius: "50%" }}
        />
      </Grid>
      <Grid
        item
        sm={12}
        md={6}
        spacing={4}
        className={styles.body}
        style={{ height: "100%" }}
      >
        <div className={styles.body}>
          <Typography
            variant="h3"
            component="h2"
            style={{ color: "#3f51b5", fontWeight: "bold" }}
          >
            Sign up
          </Typography>
        </div>
        <Grid item>
          <TextField
            select
            label="Category"
            variant="outlined"
            className={styles.inputBox}
            value={signupDetails.type}
            onChange={(event) => {
              handleInput("type", event.target.value);
            }}
          >
            <MenuItem value="applicant">Applicant</MenuItem>
            <MenuItem value="recruiter">Recruiter</MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            label="Name"
            value={signupDetails.name}
            onChange={(event) => handleInput("name", event.target.value)}
            className={styles.inputBox}
            error={inputError.name.error}
            helperText={inputError.name.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("name", true, "Name is required");
              } else {
                handleInputError("name", false, "");
              }
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <TextField
            label="Email"
            variant="outlined"
            value={signupDetails.email}
            onChange={(event) => handleInput("email", event.target.value)}
            inputError={inputError}
            handleInputError={handleInputError}
            helperText={inputError.email.message}
            error={inputError.email.error}
            onBlur={handleEmailError}
            className={styles.inputBox}
            margin="normal"
          />
        </Grid>
        <Grid item>
          <TextField
            label="Password"
            variant="outlined"
            value={signupDetails.password}
            onChange={(event) => handleInput("password", event.target.value)}
            className={styles.inputBox}
            error={inputError.password.error}
            helperText={inputError.password.message}
            onBlur={handlePasswordError}
            margin="normal"
            type="password"
          />
        </Grid>
        {signupDetails.type === "applicant" ? (
          <>
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
                onChange={(chips) =>
                  setSignupDetails({ ...signupDetails, skills: chips })
                }
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
              <FileInput
                className={styles.inputBox}
                label="Profile Photo (.jpg/.png)"
                icon={<FaceIcon />}
                uploadTo={apiList.uploadProfileImage}
                handleInput={handleInput}
                identifier={"profile"}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item style={{ width: "100%" }}>
              <TextField
                label="Bio (upto 250 words)"
                multiline
                rows={8}
                style={{ width: "100%" }}
                variant="outlined"
                value={signupDetails.bio}
                onChange={(event) => {
                  if (
                    event.target.value.split(" ").filter(function (n) {
                      return n != "";
                    }).length <= 250
                  ) {
                    handleInput("bio", event.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item>
              <PhoneInput
                country={"ca"}
                value={phone}
                onChange={(phone) => setPhone(phone)}
                className={styles.inputBox}
              />
            </Grid>
          </>
        )}

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              signupDetails.type === "applicant"
                ? handleSingup()
                : handleSingupRecruiter();
            }}
            className={styles.submitButton}
            style={{ borderRadius: "8px", width: "130px", height: "50px" }}
          >
            Signup
          </Button>
        </Grid>
      </Grid>
    </Grid>
    // </Paper>
  );
};

export default SignupPage;
