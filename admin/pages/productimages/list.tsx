import { useEffect, useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { Select, message, Image, Table, Popconfirm, Button } from "antd";
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

type SelectOption = {
  label: string;
  value: string;
};

type ProductRef = {
  _id: string;
  title?: string;
};

type ProductImageItem = {
  _id: string;
  order?: number;
  title?: string;
  image?: string;
  product_id?: ProductRef;
  children?: unknown;
};

type ProductImagesListProps = {
  getData?: ProductImageItem[];
};

const Default: NextPage<ProductImagesListProps> = ({ getData = [] }) => {
  const intl = useIntl();
  const [data, setData] = useState<ProductImageItem[]>(getData);
  const [dataProducts, setDataProducts] = useState<SelectOption[]>([]);
  const { user } = useSelector((state: RootState) => state.login);
  const { role } = user;
  const { query } = useRouter();
  const id = typeof query.id === "string" ? query.id : undefined;

  const columns: ColumnsType<ProductImageItem> = [
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
      title: intl.messages["app.pages.common.image"],
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <>
          {record.image ? <Image src={IMG_URL + record.image} height={80} /> : ""}
        </>
      ),
    },
    {
      title: intl.messages["app.pages.common.action"],
      key: "_id",
      width: 360,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["productimages/id"] ? (
            <Link href={"/productimages/" + record._id}>
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
          {role["productimagesdelete"] ? (
            <>
              {record.children ? (
                ""
              ) : (
                <Popconfirm
                  placement="left"
                  title={intl.messages["app.pages.common.youSure"]}
                  onConfirm={() => deleteData(record._id, record.image, id)}
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

  const getDataFc = (productId?: string) => {
    axios
      .get<ProductImageItem[]>(API_URL + "/productimages")
      .then((res) => {
        if (res.data.length > 0) {
          const data = res.data;
          if (productId) {
            setData(
              data.filter((item: ProductImageItem) =>
                item.product_id?._id == productId
              )
            );
          } else {
            setData(data);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDataFc(id);
    getDataProducts();
  }, [id]);

  const getDataProducts = () => {
    axios
      .get(`${API_URL}/products`)
      .then((res) => {
        if (res.data.length > 0) {
          const dataManipulate = res.data.map((item: ProductRef) => ({
            label: item.title ?? "",
            value: item._id,
          }));
          setDataProducts(dataManipulate);
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteData = (
    imageId: string,
    imagePath: string | number = 0,
    queryId?: string
  ) => {
    axios.delete(`${API_URL}/productimages/${imageId}`).then(() => {
      message.success(intl.messages["app.pages.common.deleteData"]);
      getDataFc(queryId);
      if (queryId) {
        Router.push("/productimages/list?id=" + queryId);
      } else {
        Router.push("/productimages/list");
      }
    });

    if (imagePath != 0) {
      axios
        .post(`${API_URL}/upload/deleteproductimage`, { path: imagePath })
        .then(() => {
          message.success(intl.messages["app.pages.common.deleteData"]);
          getDataFc(queryId);
          if (queryId) {
            Router.push("/productimages/list?id=" + queryId);
          } else {
            Router.push("/productimages/list");
          }
        });
    }
  };

  return (
    <div>
      <IntlMessages id="app.pages.productimages.product" /> :{" "}
      <Select
        defaultValue={id}
        options={dataProducts}
        onChange={(selectedId) => {
          getDataFc(selectedId);
          Router.push("/productimages/list?id=" + selectedId);
        }}
        className=" w-50"
      />
      <div className="w-full">
        {role["productimages/add"] ? (
          <Link href={"/productimages/add?id=" + id}>
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
          title={() => intl.messages["app.pages.productimages.list"]}
          columns={columns}
          pagination={{ position: ["bottomRight"] }}
          dataSource={data}
          expandable={{ defaultExpandAllRows: true }}
          rowKey="_id"
        />
      </div>
    </div>
  );
};

Default.getInitialProps = async ({ req, query }: NextPageContext) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const res = await axios.get<ProductImageItem[]>(API_URL + "/productimages", {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    const dataManipulate = res.data;

    if (query.id) {
      return {
        getData: dataManipulate.filter(
          (x: ProductImageItem) => x.product_id?._id == query.id
        ),
      };
    } else {
      return { getData: dataManipulate };
    }
  }
};

export default Default;
