import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { message, Table, Popconfirm, Tooltip, Button } from "antd";
import {
  EditOutlined,
  CheckCircleOutlined,
  CloseSquareOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "@root/config";
import { useIntl } from "react-intl";
import IntlMessages from "@app/util/IntlMessages";
import type { ColumnsType } from "antd/es/table";
import type { NextPage, NextPageContext } from "next";
import type { RootState } from "@app/redux/reducers";

type CustomerItem = {
  _id: string;
  name?: string;
  surname?: string;
  username?: string;
  isActive?: boolean;
};

type CustomersListProps = {
  getData?: CustomerItem[];
};

const Default: NextPage<CustomersListProps> = ({ getData = [] }) => {
  const intl = useIntl();
  const [data, setData] = useState<CustomerItem[]>(getData);
  const { user } = useSelector((state: RootState) => state.login);
  const { role } = user;

  const columns: ColumnsType<CustomerItem> = [
    {
      title: intl.messages["app.pages.common.nameSurname"],
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span className="link">
          {record.name} {record.surname}
        </span>
      ),
    },
    {
      title: intl.messages["app.pages.common.email"],
      dataIndex: "username",
      key: "username",
    },
    {
      title: intl.messages["app.pages.common.action"],
      key: "_id",
      width: 360,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["customers/id"] ? (
            <div>
              <Popconfirm
                placement="left"
                title={intl.messages["app.pages.common.youSure"]}
                onConfirm={() =>
                  activeOrDeactive(record._id, Boolean(record.isActive))
                }
              >
                <Tooltip
                  placement="bottomRight"
                  title={
                    Boolean(record.isActive)
                      ? intl.messages["app.pages.common.bePassive"]
                      : intl.messages["app.pages.common.beActive"]
                  }
                >
                  <a>
                    {Boolean(record.isActive) ? (
                      <CheckCircleOutlined
                        style={{ fontSize: "150%", marginLeft: "15px" }}
                      />
                    ) : (
                      <CloseSquareOutlined
                        style={{ fontSize: "150%", marginLeft: "15px" }}
                      />
                    )}{" "}
                  </a>
                </Tooltip>
              </Popconfirm>
              <Link href={"/customers/" + record._id}>
                <a>
                  {" "}
                  <EditOutlined
                    style={{ fontSize: "150%", marginLeft: "15px" }}
                  />
                </a>
              </Link>
            </div>
          ) : (
            ""
          )}
        </span>
      ),
    },
  ];

  const getDataFc = () => {
    axios
      .get(API_URL + "/customers")
      .then((response) => {
        if (response.data.length > 0) {
          setData(response.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDataFc();
  }, []);

  const activeOrDeactive = (id: string, deg?: boolean) => {
    axios
      .post(`${API_URL}/customers/active/${id}`, { isActive: !deg })
      .then(() => {
        message.success(intl.messages["app.pages.common.changeActive"]);
        getDataFc();
        Router.push("/customers/list");
      });
  };

  return (
    <div>
      {role["customers/add"] ? (
        <Link href="/customers/add">
          <Button
            type="primary"
            className="float-right addbtn"
            icon={<AppstoreAddOutlined />}
          >
            <IntlMessages id="app.pages.common.create" />
          </Button>
        </Link>
      ) : (
        ""
      )}
      <Table
        title={() => intl.messages["app.pages.customers.list"]}
        columns={columns}
        pagination={{ position: ["bottomRight"] }}
        dataSource={data}
        expandable={{ defaultExpandAllRows: true }}
        rowKey="_id"
      />
    </div>
  );
};

Default.getInitialProps = async ({ req }: NextPageContext) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const res = await axios.get(API_URL + "/customers", {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    return { getData: res.data };
  }
};

export default Default;
