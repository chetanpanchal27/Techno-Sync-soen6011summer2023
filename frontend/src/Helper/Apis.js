export const baseURL = "http://localhost:5000";
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
  downloadResume: `${baseURL}/download/resume`,
  candidates: `${baseURL}/api/candidates`,
  candidatesApplications: `${baseURL}/api/candidates/applications`,
};

export default apiList;
