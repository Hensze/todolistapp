import { userStorageName } from "../Redux/userSlice";
import { userType } from "../Types";

export const getcurentUser = () => {
  let user = localStorage.getItem(userStorageName);
  if (user) {
    const currentLogUserObj: userType = JSON.parse(user);
    return currentLogUserObj;
  }
  return null;
};
