import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { message, Image, Table, Popconfirm, Button, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CloseSquareOutlined,
  CheckCircleOutlined,
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

type BrandItem = {
  _id: string;
  title: string;
  order?: number;
  image?: string;
  isActive?: boolean;
  children?: unknown;
};

type BrandsListProps = {
  getData?: BrandItem[];
};

const Default: NextPage<BrandsListProps> = ({ getData = [] }) => {
  const intl = useIntl();
  const [data, setData] = useState<BrandItem[]>(getData);
  const { user } = useSelector((state: RootState) => state.login);
  const { role } = user;

  const columns: ColumnsType<BrandItem> = [
    {
      title: intl.messages["app.pages.brands.order"],
      dataIndex: "order",
      key: "order",
    },
    {
      title: intl.messages["app.pages.brands.title"],
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: intl.messages["app.pages.brands.icon"],
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <>
          {record.image !== "" ? (
            <Image src={IMG_URL + record.image} height={80} />
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      title: intl.messages["app.pages.brands.action"],
      key: "_id",
      width: 360,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["brands/id"] ? (
            <>
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

              <Link href={"/brands/" + record._id}>
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
          {role["brandsdelete"] ? (
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
      .get(API_URL + "/brands")
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

  const activeOrDeactive = (id: string, deg: boolean) => {
    axios
      .post(`${API_URL}/brands/active/${id}`, { isActive: !deg })
      .then(() => {
        message.success(intl.messages["app.pages.common.changeActive"]);
        getDataFc();
        Router.push("/brands/list");
      });
  };

  const deleteData = (id: string, imagePath: string | number = 0) => {
    axios.delete(`${API_URL}/brands/${id}`).then(() => {
      message.success(intl.messages["app.pages.common.deleteData"]);
      getDataFc();
      Router.push("/brands/list");
    });

    if (imagePath != 0) {
      axios
        .post(`${API_URL}/upload/deletebrandsimage`, { path: imagePath })
        .then(() => {
          message.success("Delete Data");
          getDataFc();
          Router.push("/brands/list");
        });
    }
  };

  return (
    <div>
      {role["brands/add"] ? (
        <Link href={"/brands/add"}>
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
        title={() => "Brands List"}
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
    const res = await axios.get(API_URL + "/brands", {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    const dataManipulate = res.data;

    return { getData: dataManipulate };
  }
};

export default Default;
