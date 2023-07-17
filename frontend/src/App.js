import { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./views/Login";
import MessagePopupBox from "./Helper/MessagePopupBox";
import { Grid, makeStyles } from "@material-ui/core";
import SignUpPage from "./views/Signup";

const useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "98vh",
    paddingTop: "64px",
    boxSizing: "border-box",
    width: "100%",
  },
}));

export const PopupContext = createContext();
function App() {
  const styles = useStyles();
  const [popup, setPopup] = useState({
    isOpen: false,
    severity: "",
    message: "",
  });

  return (
    <BrowserRouter>
      <PopupContext.Provider value={setPopup}>
        <Grid container direction="column">
          <Grid item></Grid>
          <Grid item className={styles.body}>
            <Routes>
              <Route path="/" element={<LoginPage />}></Route>
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/signup" element={<SignUpPage />}></Route>
            </Routes>
          </Grid>
        </Grid>
      </PopupContext.Provider>
      <MessagePopupBox
        open={popup.isOpen}
        setOpen={(status) =>
          setPopup({
            ...popup,
            isOpen: status,
          })
        }
        severity={popup.severity}
        message={popup.message}
      />
    </BrowserRouter>
  );
}

export default App;
