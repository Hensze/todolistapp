import React, { useEffect } from "react";
import Login from "../Compounents/Login";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../Redux/hooks";

const LoginPage = () => {
  const navigate = useNavigate();
  const { curentUser } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!curentUser) {
      navigate("/auth");
    }
  }, [curentUser]);
  return (
    <div className=" h-[100vh] flex items-center justify-center p-10">
      {/*login */}

      <Login />

      <div className="h-full w-full bg-gradient-to-r from-myBlue to-myPink opacity-70 absolute top-0 -z-10" />
      <div className="h-full w-full absolute bg-pattern -z-20 top-0" />
    </div>
  );
};

export default LoginPage;
