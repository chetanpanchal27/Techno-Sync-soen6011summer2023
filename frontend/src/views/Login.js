import React, { useContext, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Avatar,
  Link,
  makeStyles,
} from "@material-ui/core";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import axios from "axios";
import apiList from "../Helper/Apis";
import getToken from "../Helper/Auth";
import { PopupContext } from "../App";
import { Navigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      TEAM Techno Sync {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // minHeight: "98vh",
    // paddingTop: "64px",
    boxSizing: "border-box",
    // width: "100%",
  },
  inputBox: {
    width: "300px",
  },
  submitButton: {
    width: "300px",
  },
}));
const LoginPage = () => {
  const styles = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const setPopup = useContext(PopupContext);

  const handleUsernameChange = (event) => {
    console.log("User name -> ", event.target.value);
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(getToken());

  const [inputError, setInputError] = useState({
    username: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });

  const handleInputError = (key, status, message) => {
    setInputError({
      ...inputError,
      [key]: {
        error: status,
        message: message,
      },
    });
  };

  const handleUsernameError = (event) => {
    const username = event.target.value;
    if (username === "") {
      if (true) {
        handleInputError("username", true, "Email is required");
      }
    } else {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(event.target.value).toLowerCase())) {
        handleInputError("username", false, "");
      } else {
        handleInputError("username", true, "Incorrect email format");
      }
    }
    console.log("Input Erroe - > ", inputError);
  };

  const handlePasswordError = (event) => {
    if (event.target.value === "") {
      handleInputError("password", true, "Password is required");
    } else {
      handleInputError("password", false, "");
    }
  };
  const handleSubmit = (event) => {
    console.log("Button Clicked !!", username, password);
    event.preventDefault();
    // Perform login logic here with username and password
    const isComplete = !Object.keys(inputError).some((obj) => {
      return inputError[obj].error;
    });
    const loginDetails = {
      email: username,
      password: password,
    };
    if (isComplete) {
      axios
        .post(apiList.login, loginDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setIsLoggedIn(getToken());
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
            message: err?.response?.data?.message,
          });
          console.log(err.response);
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  return isLoggedIn ? (
    <Navigate to="/home" />
  ) : (
    <Grid container style={{ marginTop: "5%" }}>
      <Grid item sm={12} md={6}>
        <div className={styles.body}>
          <img
            src="https://cdn.pixabay.com/photo/2015/06/10/07/03/building-804526_1280.jpg"
            // src="./assets/images/home.jpg"
            width={500}
            height={500}
            style={{ borderRadius: "50%" }}
          />
        </div>
      </Grid>
      <Grid item sm={12} md={6}>
        <div className={styles.body} style={{ height: "100%" }}>
          <div className={styles.body}>
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              variant="h4"
              component="h2"
              style={{ color: "#3f51b5", fontWeight: "bold" }}
            >
              Sign in
            </Typography>
          </div>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              value={username}
              onChange={handleUsernameChange}
              inputError={inputError}
              handleInputError={handleInputError}
              helperText={inputError.username.message}
              error={inputError.username.error}
              onBlur={handleUsernameError}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              variant="outlined"
              value={password}
              onChange={handlePasswordChange}
              inputError={inputError}
              handleInputError={handleInputError}
              type="password"
              helperText={inputError.password.message}
              error={inputError.password.message}
              onBlur={handlePasswordError}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </div>
          </form>
        </div>
      </Grid>
      {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </Grid>
  );
};

export default LoginPage;
