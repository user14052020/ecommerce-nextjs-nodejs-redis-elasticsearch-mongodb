import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { message, Image, Table, Popconfirm, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL, IMG_URL } from "@root/config";
import { useIntl } from "react-intl";
import IntlMessages from "@app/util/IntlMessages";
import type { ColumnsType } from "antd/es/table";
import type { NextPage, NextPageContext } from "next";
import type { RootState } from "@app/redux/reducers";

type OrderStatusItem = {
  _id: string;
  title?: string;
  order?: number;
  image?: string;
  children?: unknown;
};

type OrderStatusListProps = {
  getData?: OrderStatusItem[];
};

const Default: NextPage<OrderStatusListProps> = ({ getData = [] }) => {
  const intl = useIntl();
  const [data, setData] = useState<OrderStatusItem[]>(getData);
  const { user } = useSelector((state: RootState) => state.login);
  const { role } = user;
  const columns: ColumnsType<OrderStatusItem> = [
    {
      title: intl.messages["app.pages.common.order"],
      dataIndex: "order",
      key: "order",
    },
    {
      title: intl.messages["app.pages.common.title"],
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: intl.messages["app.pages.common.icon"],
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <>{record.image ? <Image src={IMG_URL + record.image} height={80} /> : ""}</>
      ),
    },
    {
      title: intl.messages["app.pages.common.action"],
      key: "_id",
      width: 360,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["orderstatus/id"] ? (
            <Link href={"/orderstatus/" + record._id}>
              <a>
                {" "}
                <EditOutlined
                  style={{ fontSize: "150%", marginLeft: "15px" }}
                />
              </a>
            </Link>
          ) : (
            ""
          )}
          {role["orderstatusdelete"] ? (
            <>
              {record.children ? (
                ""
              ) : (
                <Popconfirm
                  placement="left"
                  title={intl.messages["app.pages.common.sureToDelete"]}
                  onConfirm={() => deleteData(record._id, record.image)}
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
      .get(API_URL + "/orderstatus")
      .then((res) => {
        if (res.data.length > 0) {
          const data = res.data;
          setData(data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDataFc();
  }, []);

  const deleteData = (id: string, imagePath: string | number = 0) => {
    axios.delete(`${API_URL}/orderstatus/${id}`).then(() => {
      message.success(intl.messages["app.pages.common.deleteData"]);
      getDataFc();
      Router.push("/orderstatus/list");
    });

    if (imagePath != 0) {
      axios
        .post(`${API_URL}/upload/deleteorderstatusimage`, { path: imagePath })
        .then(() => {
          message.success(intl.messages["app.pages.common.deleteData"]);
          getDataFc();
          Router.push("/orderstatus/list");
        });
    }
  };

  return (
    <div>
      {role["orderstatus/add"] ? (
        <Link href={"/orderstatus/add"}>
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
        title={() => intl.messages["app.pages.orderStatus.list"]}
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
    const res = await axios.get(API_URL + "/orderstatus", {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    const dataManipulate = res.data;

    return { getData: dataManipulate };
  }
};

export default Default;
