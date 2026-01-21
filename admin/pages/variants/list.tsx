import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";

import { Space, Tag, message, Table, Popconfirm, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "@root/config";

import { useIntl } from "react-intl";
import IntlMessages from "@app/util/IntlMessages";
import type { ColumnsType } from "antd/es/table";
import type { RootState } from "@app/redux/reducers";

type VariantOption = {
  name?: string;
};

type VariantItem = {
  _id: string;
  name?: string;
  variants: VariantOption[];
};

const Default = () => {
  const intl = useIntl();

  const [data, setData] = useState<VariantItem[]>([]);
  const { user } = useSelector((state: RootState) => state.login);
  const { role } = user;

  const columns: ColumnsType<VariantItem> = [
    {
      title: intl.messages["app.pages.common.name"],
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: intl.messages["app.pages.common.variants"],
      dataIndex: "variants",
      key: "variants",

      render: (_, record) => (
        <Space>
          {record.variants.map(({ name }) => (
            <Tag color="purple" key={name ?? "variant"}>
              {name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: intl.messages["app.pages.common.action"],
      key: "action",
      width: 360,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["variantsdelete"] ? (
            <Popconfirm
              placement="left"
              title="Sure to delete?"
              onConfirm={() => deleteData(record._id)}
            >
              <a>
                <DeleteOutlined
                  style={{ fontSize: "150%", marginLeft: "15px" }}
                />{" "}
              </a>
            </Popconfirm>
          ) : (
            ""
          )}
          {role["variants/id"] ? (
            <Link href={"/variants/" + record._id}>
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
        </span>
      ),
    },
  ];

  const getData = () => {
    axios
      .get(API_URL + "/variants")
      .then((response) => {
        console.log(response.data);
        if (response.data.length > 0) {
          setData(response.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteData = (id: string) => {
    axios.delete(`${API_URL}/variants/${id}`).then(() => {
      message.success(intl.messages["app.pages.common.deleteData"]);
      setData(data.filter((item) => item._id !== id));
      getData();
      Router.push("/variants/list");
    });
  };

  return (
    <div>
      {role["variants/add"] ? (
        <Link href="/variants/add">
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
        className="table-responsive"
        title={() => intl.messages["app.pages.variants.list"]}
        columns={columns}
        pagination={{ position: ["bottomRight"] }}
        dataSource={data}
      />
    </div>
  );
};

export default Default;
