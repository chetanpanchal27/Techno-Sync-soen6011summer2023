import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useNavigate } from "react-router-dom";
import getToken, { getUserType } from "../Helper/Auth";
import { AccountCircle } from "@material-ui/icons";
import { Menu, MenuItem } from "@material-ui/core";

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

const NavBar = () => {
  const styles = useStyles();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (location) => {
    navigate(location);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.body}>
      <AppBar position="static" style={{ background: "#7e7272" }}>
        <Toolbar>
          <Typography variant="h6" className={styles.title}>
            JOB STATION
          </Typography>
          {getUserType() === "recruiter" ? (
            <>
              <Button color="inherit" onClick={() => handleClick("/home")}>
                <Typography style={{ fontSize: "18px" }}>ViewJobs</Typography>
              </Button>
              <Button color="inherit" onClick={() => handleClick("/addjob")}>
                <Typography style={{ fontSize: "18px" }}>AddJobs</Typography>
              </Button>
              <Button color="inherit" onClick={() => handleClick("/jobs")}>
                <Typography style={{ fontSize: "18px" }}>PostedJobs</Typography>
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
                  <AccountCircle />
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
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={() => handleClick("/logout")}>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => handleClick("/home")}>
                <Typography style={{ fontSize: "18px" }}>ViewJobs</Typography>
              </Button>

              <Button color="inherit" onClick={() => handleClick("/logout")}>
                <Typography style={{ fontSize: "18px" }}>Logout</Typography>
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
                  <AccountCircle />
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
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
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
};
export default NavBar;
