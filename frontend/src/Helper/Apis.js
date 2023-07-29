import axios from "axios";

// export default axios.create({
//   baseURL: `http://localhost:5000`,
// });
export const baseURL = "http://localhost:5000";
//export const server = "https://secret-shelf-87665.herokuapp.com";

const apiList = {
  login: `${baseURL}/auth/login`,
  signup: `${baseURL}/auth/signup`,
  uploadResume: `${baseURL}/upload/resume`,
  uploadProfileImage: `${baseURL}/upload/profile`,
  jobs: `${baseURL}/api/jobs`,
  applications: `${baseURL}/api/applications`,
  rating: `${baseURL}/api/rating`,
  user: `${baseURL}/api/user`,
  applicants: `${baseURL}/api/applicants`,
  employers: `${baseURL}/api/employers`,
};

export default apiList;
