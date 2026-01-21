import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";

import { message, Table, Popconfirm, Tooltip, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
  CheckCircleOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "@root/config";
import func from "@app/util/helpers/func";

import { useIntl } from "react-intl";
import IntlMessages from "@app/util/IntlMessages";
import type { ColumnsType } from "antd/es/table";
import type { NextPage, NextPageContext } from "next";
import type { RootState } from "@app/redux/reducers";

type TopMenuItem = {
  _id: string;
  title?: string;
  order?: number;
  isActive?: boolean;
  children?: unknown;
};

type TopMenuListProps = {
  getData?: TopMenuItem[];
};

const Default: NextPage<TopMenuListProps> = ({ getData = [] }) => {
  const intl = useIntl();

  const [data, setData] = useState<TopMenuItem[]>(getData);
  const { user } = useSelector((state: RootState) => state.login);
  const { role } = user;

  const columns: ColumnsType<TopMenuItem> = [
    {
      title: intl.messages["app.pages.common.order"],
      dataIndex: "order",
      key: "order",
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: intl.messages["app.pages.common.title"],
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: intl.messages["app.pages.common.action"],
      key: "_id",
      width: 360,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["topmenu/id"] ? (
            <>
              <Popconfirm
                placement="left"
                title="Are You Sure ?"
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
              <Link href={"/topmenu/" + record._id}>
                <a>
                  {" "}
                  <EditOutlined
                    style={{ fontSize: "150%", marginLeft: "15px" }}
                  />
                </a>
              </Link>
            </>
          ) : (
            ""
          )}
          {role["topmenudelete"] ? (
            <>
              {record.children ? (
                ""
              ) : (
                <Popconfirm
                  placement="left"
                  title={intl.messages["app.pages.common.sureToDelete"]}
                  onConfirm={() => deleteData(record._id)}
                >
                  <a>
                    <DeleteOutlined
                      style={{ fontSize: "150%", marginLeft: "15px" }}
                    />{" "}
                  </a>
                </Popconfirm>
              )}
            </>
          ) : (
            ""
          )}
        </span>
      ),
    },
  ];

  const getDataFc = () => {
    axios
      .get(API_URL + "/topmenu")
      .then((response) => {
        if (response.data.length > 0) {
          const maniplationData = func.getCategoriesTree(
            response.data
          ) as TopMenuItem[];
          setData(maniplationData);
        }
      })
      .catch((err) => console.log(err));
  };

  const activeOrDeactive = (id: string, deg?: boolean) => {
    axios
      .post(`${API_URL}/topmenu/active/${id}`, { isActive: !deg })
      .then(() => {
        message.success(intl.messages["app.pages.common.chageActive"]);
        getDataFc();
        Router.push("/topmenu/list");
      });
  };

  useEffect(() => {
    getDataFc();
  }, []);

  const deleteData = (id: string) => {
    axios.delete(`${API_URL}/topmenu/${id}`).then(() => {
      message.success(intl.messages["app.pages.common.deleteData"]);
      getDataFc();
      Router.push("/topmenu/list");
    });
  };

  return (
    <div>
      {role["topmenu/add"] ? (
        <Link href="/topmenu/add">
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
        title={() => intl.messages["app.pages.topmenu.list"]}
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
    const res = await axios.get(API_URL + "/topmenu", {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    const dataManipulate = func.getCategoriesTree(res.data) as TopMenuItem[];

    return { getData: dataManipulate };
  }
};

export default Default;
