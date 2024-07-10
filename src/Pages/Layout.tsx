import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../Compounents/Header";
import { useAppSelector } from "../Redux/hooks";

type Props = {};

function Layout({}: Props) {
  const navigate = useNavigate();
  const { curentUser } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!curentUser) {
      navigate("/auth");
    }
  }, [curentUser]);
  return (
    <div className="h-[100vh] flex flex-col">
      <Header />
      <div className="bg-pattern flex-1 max-h-[90%] overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
