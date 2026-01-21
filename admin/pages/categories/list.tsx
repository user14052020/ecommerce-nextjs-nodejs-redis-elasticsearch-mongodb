import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { message, Table, Popconfirm, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
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

type CategoryItem = {
  _id: string;
  title?: string;
  order?: number;
  description?: string;
  children?: CategoryItem[];
};

type CategoriesListProps = {
  getData?: CategoryItem[];
};

const Default: NextPage<CategoriesListProps> = ({ getData = [] }) => {
  const intl = useIntl();
  const [data, setData] = useState<CategoryItem[]>(getData);
  const { user } = useSelector((state: RootState) => state.login);
  const { role } = user;

  const columns: ColumnsType<CategoryItem> = [
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
      title: intl.messages["app.pages.common.description"],
      dataIndex: "description",
      key: "description",
    },
    {
      title: intl.messages["app.pages.common.action"],
      key: "_id",
      width: 360,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["categories/id"] ? (
            <Link href={"/categories/" + record._id}>
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
          {role["categoriesdelete"] ? (
            <>
              {record.children ? (
                ""
              ) : (
                <Popconfirm
                  placement="left"
                  title={intl.messages["app.pages.common.youSure"]}
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
      .get(API_URL + "/categories")
      .then((response) => {
        if (response.data.length > 0) {
          const maniplationData = func.getCategoriesTree(response.data) as
            CategoryItem[];
          setData(maniplationData);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDataFc();
  }, []);

  const deleteData = (id: string) => {
    axios.delete(`${API_URL}/categories/${id}`).then(() => {
      message.success(intl.messages["app.pages.common.deleteData"]);
      getDataFc();
      Router.push("/categories/list");
    });
  };

  return (
    <div>
      {role["categories/add"] ? (
        <Link href="/categories/add">
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
      <h5>
        {" "}
        <IntlMessages id="app.pages.category.list" />{" "}
      </h5>
      <Table
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
    const res = await axios.get<CategoryItem[]>(API_URL + "/categories", {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    const dataManipulate = func.getCategoriesTree(res.data) as CategoryItem[];

    return { getData: dataManipulate };
  }
};

export default Default;
