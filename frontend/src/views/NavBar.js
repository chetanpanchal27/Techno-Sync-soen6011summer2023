import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { useNavigate } from "react-router-dom";
import { Avatar, Menu, MenuItem } from "@material-ui/core";
import axios from "axios";
import { getUserType } from "../Helper/Auth";
import apiList from "../Helper/Apis";
import { PopupContext } from "../App";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  body: {
    flexDirection: "column",
    width: "100%",
  },
}));

function NavBar() {
  const styles = useStyles();
  const navigate = useNavigate();

  const [userData, setUserData] = useState("");
  const setPopup = useContext(PopupContext);
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    getData();
  }, []);

  const handleClick = (location) => {
    navigate(location);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUserData(response.data);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <div className={styles.body}>
      <AppBar position="static" style={{ background: "#7e7272" }}>
        <Toolbar>
          <Typography
            variant="h6"
            onClick={() => handleClick("/home")}
            style={{ cursor: "pointer" }}
          >
            JOB STATION
          </Typography>

          <Typography variant="h6" className={styles.title}>
            &nbsp;&nbsp;Welcome, back {userData?.name}
          </Typography>
          {getUserType() === "recruiter" ? (
            <>
              <Button color="inherit" onClick={() => handleClick("/addjob")}>
                <Typography style={{ fontSize: "18px" }}>AddJobs</Typography>
              </Button>
              <Button color="inherit" onClick={() => handleClick("/jobs")}>
                <Typography style={{ fontSize: "18px" }}>PostedJobs</Typography>
              </Button>
              <Button
                color="inherit"
                onClick={() => handleClick("/applicants")}
              >
                <Typography style={{ fontSize: "18px" }}>Applicants</Typography>
              </Button>
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar
                    alt="Recruiter"
                    src={userData.profile}
                    style={{ objectFit: "fill" }}
                  />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => handleClick("/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => handleClick("/logout")}>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </>
          ) : getUserType() === "applicant" ? (
            <>
              <Button
                color="inherit"
                onClick={() => handleClick("/userapplications")}
              >
                <Typography style={{ fontSize: "18px" }}>Applied</Typography>
              </Button>

              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  {/* <AccountCircle /> */}
                  <Avatar
                    alt="User"
                    src={userData.profile}
                    style={{ objectFit: "fill" }}
                  />
                </IconButton>

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => handleClick("/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => handleClick("/logout")}>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => handleClick("/employers")}>
                <Typography style={{ fontSize: "18px" }}>Employers</Typography>
              </Button>

              <Button
                color="inherit"
                onClick={() => handleClick("/candidates")}
              >
                <Typography style={{ fontSize: "18px" }}>Candidates</Typography>
              </Button>

              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar
                    alt="Admin"
                    src={userData.profile}
                    style={{ objectFit: "fill" }}
                  />
                </IconButton>

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => handleClick("/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => handleClick("/logout")}>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
export default NavBar;
