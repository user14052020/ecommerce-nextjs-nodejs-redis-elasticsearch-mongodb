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
import { API_URL, IMG_URL } from "@root/config";
import func from "@app/util/helpers/func";
import { useIntl } from "react-intl";
import IntlMessages from "@app/util/IntlMessages";
import type { ColumnsType } from "antd/es/table";
import type { NextPage, NextPageContext } from "next";
import type { RootState } from "@app/redux/reducers";

type HomeSliderItem = {
  _id: string;
  title?: string;
  order?: number;
  description?: string;
  image?: string;
  isActive?: boolean;
  children?: unknown;
};

type HomeSliderListProps = {
  getData?: HomeSliderItem[];
};

const Default: NextPage<HomeSliderListProps> = ({ getData = [] }) => {
  const intl = useIntl();
  const [data, setData] = useState<HomeSliderItem[]>(getData);
  const { user } = useSelector((state: RootState) => state.login);
  const { role } = user;

  const columns: ColumnsType<HomeSliderItem> = [
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
      title: intl.messages["app.pages.common.image"],
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <>
          {record.image ? (
            <img src={IMG_URL + record.image} height={80} width={100} />
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      title: intl.messages["app.pages.common.action"],
      key: "_id",
      width: 360,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["homeslider/id"] ? (
            <Link href={"/homeslider/" + record._id}>
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
          {role["homesliderdelete"] ? (
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

  const activeOrDeactive = (id: string, deg?: boolean) => {
    axios
      .post(`${API_URL}/homeslider/active/${id}`, { isActive: !deg })
      .then(() => {
        message.success(intl.messages["app.pages.common.chageActive"]);
        getDataFc();
        Router.push("/homeslider/list");
      });
  };

  const getDataFc = () => {
    axios
      .get(API_URL + "/homeslider")
      .then((response) => {
        if (response.data.length > 0) {
          const maniplationData = func.getCategoriesTree(response.data) as
            HomeSliderItem[];
          setData(maniplationData);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDataFc();
  }, []);

  const deleteData = (id: string) => {
    axios.delete(`${API_URL}/homeslider/${id}`).then(() => {
      message.success(intl.messages["app.pages.common.deleteData"]);
      getDataFc();
      Router.push("/homeslider/list");
    });
  };

  return (
    <div>
      {role["homeslider/add"] ? (
        <Link href="/homeslider/add">
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
        <IntlMessages id="app.pages.homeSlider.list" />{" "}
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
    const res = await axios.get<HomeSliderItem[]>(API_URL + "/homeslider", {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    const dataManipulate = func.getCategoriesTree(res.data) as HomeSliderItem[];

    return { getData: dataManipulate };
  }
};

export default Default;
