const getToken = () => {
  return localStorage.getItem("token");
};

export const getUserType = () => {
  return localStorage.getItem("type");
};

export default getToken;
