const passportStrategiesEnum = {
  JWT: "jwt",
  GITHUB: "github",
  GITHUB_LOGIN: "github",
  LOCALREGISTER: "register",
  LOCALLOGIN: "login",
  NA: "na",
};

const accessRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
  PUBLIC: "PUBLIC",
};

export { accessRolesEnum, passportStrategiesEnum };
