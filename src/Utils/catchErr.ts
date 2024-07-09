import { toastErr, toastInfo } from "./toast";

const CatchErr = (err: { code?: string }) => {
  const { code } = err;
  if (code === "auth/invalid-email") toastErr("invalid email");
  else if (code === "auth/weak-password ")
    toastErr("password should be atleast 6 characters");
  else if (code === "auth/user-not-found ") toastErr("user not found");
  else if (code === "auth/weak-password ")
    toastErr("password should be atleast 6 characters");
  else if (code === "auth/email-already-in-use")
    toastErr("email already exist");
  else if (code === "auth/require-recent-login")
    toastInfo("logout and login before updating your profile");
  else if (code === "unavailable") toastErr("Frirebase Client is offline");
  else if (code === "auth/invalid-login-credentials")
    toastErr("invalid credentials");
  else toastErr("An erro occured");
  console.log(err, err.code);
};

export default CatchErr;
