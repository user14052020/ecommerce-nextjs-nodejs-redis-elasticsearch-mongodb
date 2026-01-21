import React, { useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Divider, Avatar } from "antd";
import CircularProgress from "@app/app/components/CircularProgress";
import Clock from "@app/app/components/Clock";
import { IMG_URL } from "@root/config";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "@app/redux/reducers";

const Orders = dynamic(() => import("@app/pages/orders/list"), {
  loading: () => <CircularProgress />,
});

const Counts = dynamic(() => import("@app/app/components/Dashboard/counts"), {
  loading: () => <CircularProgress />,
});

const CrmDashboard = () => {
  const { user } = useSelector((state: RootState) => state.login);
  useEffect(() => {}, []);

  return (
    <React.Fragment>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="dashboardProfile">
        <Avatar
          size={180}
          src={IMG_URL + (typeof user.image === "string" ? user.image : "")}
          icon={<UserOutlined />}
          className="border   mt-5 mb-3"
        />
        <h4>{user.name}</h4>
        <Clock />
      </div>
      <div className="  mb-5 grid grid-cols-12">
        <Counts />
        <Divider />
        <div className=" mt-5 col-span-12">
          <Orders />
        </div>
      </div>
    </React.Fragment>
  );
};

export default CrmDashboard;
