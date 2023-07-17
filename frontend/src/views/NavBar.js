import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { useNavigate } from 'react-router-dom';

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


  const handleClick = (location) => {
    navigate(location);
  };

  return (
    <div className={styles.body}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={styles.title}>
            JOB STATION
          </Typography>
          {/* <Button color="inherit">Add Job</Button>           */}
          {/* <Button color="inherit">Logout</Button>   */}
          <Button color="inherit" onClick={() => handleClick("/addjob")}>
              <Typography style={{fontSize:"18px"}}>Add Jobs</Typography>
          </Button>     
          <Button color="inherit">
              <Typography style={{fontSize:"18px"}}>Logout</Typography>
              </Button>   
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default NavBar;
