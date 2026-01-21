import React, { useEffect, useState } from "react";
import Link from "next/link";

import { Layout, Menu, Dropdown, Button, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  logout_r,
  changeCollapsed_r,
  switchLanguage,
} from "@app/redux/actions";

import AuthService from "@app/util/services/authservice";
import { languageData } from "@root/config";
import router from "next/router";
import type { AppDispatch, RootState } from "@app/redux/store";
import type { LanguageInfo } from "@app/redux/types";

const { Header } = Layout;

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [size, setSize] = useState([0, 0]);
  const { user } = useSelector((state: RootState) => state.login);
  const { locale } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    if (size[0] > 770) {
      dispatch(changeCollapsed_r(false));
    }

    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {}, []);

  return (
    <Header className="site-layout-background">
      <Dropdown
        placement="topRight"
        arrow
        className="float-right w-22"
        overlay={
          <Menu>
            <Menu.Item key="0">
              <Link href={"/staff/" + user.id}>Profile</Link>
            </Menu.Item>

            <Menu.Divider key="2" />
            <Menu.Item
              key="3"
              onClick={async () => {
                await dispatch(logout_r());
                AuthService.logout();
                router.push("/signin");
              }}
            >
              Logout
            </Menu.Item>
          </Menu>
        }
      >
        <Button type="text">{user.name}</Button>
      </Dropdown>
      <Select
        showSearch
        className="float-right w-22"
        defaultValue={JSON.stringify(locale)}
        bordered={false}
        filterOption={(input, option) => {
          const label =
            typeof option === "string" ? option : (option?.toString() || "");
          return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        }}
        onChange={(newValue: string) => {
          dispatch(switchLanguage(JSON.parse(newValue) as LanguageInfo));
        }}
      >
        {languageData.map((language) => (
          <Select.Option
            key={JSON.stringify(language)}
            value={JSON.stringify(language)}
          >
            {String(language.name)}
          </Select.Option>
        ))}
      </Select>
    </Header>
  );
};

export default Sidebar;
