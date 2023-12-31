import { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Grid, makeStyles } from "@material-ui/core";
import LoginPage from "./views/Login";
import MessagePopupBox from "./Helper/MessagePopupBox";
import SignUpPage from "./views/Signup";
import HomePage from "./views/Home";
import AddJob from "./views/Employer/AddJob";
import Jobs from "./views/Employer/Jobs";
import Logout from "./views/Logout";
import { getUserType } from "./Helper/Auth";
import EmployerProfile from "./views/Employer/EmployerProfile";
import UserProfile from "./views/UserProfile";
import Applicants from "./views/Employer/Applicants";
import JobApplications from "./views/Employer/JobApplications";
import UserAppliedJobs from "./views/UserAppliedJobs";
import EmployerList from "./views/Admin/EmployerList";
import CandidateList from "./views/Admin/CandidateList";

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
    open: false,
    severity: "",
    message: "",
  });

  return (
    <BrowserRouter>
      <PopupContext.Provider value={setPopup}>
        <Grid container direction="column">
          <Grid item>{/* <NavBar /> */}</Grid>
          <Grid item>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/addjob" element={<AddJob />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/applicants" element={<Applicants />} />
              <Route path="/employers" element={<EmployerList />} />
              <Route path="/candidates" element={<CandidateList />} />

              <Route
                path="/job/applications/:jobId"
                element={<JobApplications />}
              />
              <Route
                path="/profile"
                element={
                  getUserType() === "recruiter" ? (
                    <EmployerProfile />
                  ) : getUserType() === "applicant" ? (
                    <UserProfile />
                  ) : (
                    <EmployerProfile />
                  )
                }
              />
              <Route path="/userapplications" element={<UserAppliedJobs />} />
            </Routes>
          </Grid>
        </Grid>
      </PopupContext.Provider>
      <MessagePopupBox
        open={popup.open}
        setOpen={(status) =>
          setPopup({
            ...popup,
            open: status,
          })
        }
        severity={popup.severity}
        message={popup.message}
      />
    </BrowserRouter>
  );
}

export default App;
