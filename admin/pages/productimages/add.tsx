import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "@root/config";
import Router, { useRouter } from "next/router";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Upload,
  InputNumber,
  Button,
  Card,
  message,
  Divider,
  Form,
  Input,
  Select,
} from "antd";
import { useIntl } from "react-intl";
import IntlMessages from "@app/util/IntlMessages";
import type { NextPage, NextPageContext } from "next";
import type { RootState } from "@app/redux/reducers";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

type FieldData = {
  name: string | number | (string | number)[];
  value?: unknown;
};

type SelectOption = {
  label: string;
  value: string | null;
};

type ProductRef = {
  _id: string;
  title?: string;
};

type ProductImageItem = {
  order: number;
  title?: string;
  image?: UploadChangeParam<UploadFile>;
  created_user?: { name?: string; id?: string };
  product_id?: string | null;
};

type ProductImagesFormValues = {
  product_id?: string | null;
  arrayImage: ProductImageItem[];
};

type ProductImagesAddProps = {
  getProducts?: SelectOption[];
};

const Default: NextPage<ProductImagesAddProps> = ({ getProducts = [] }) => {
  const intl = useIntl();
  const { query } = useRouter();
  const id = typeof query.id === "string" ? query.id : null;
  const [state, setState] = useState<ProductImagesFormValues>({
    product_id: null,
    arrayImage: [
      { order: 1 },
      { order: 2 },
      { order: 3 },
      { order: 4 },
      { order: 5 },
    ],
  });
  const [displaySave, setDisplaySave] = useState(true);
  const fields: FieldData[] = Object.entries(state).map(([name, value]) => ({
    name,
    value,
  }));
  const [dataProducts, setDataProducts] = useState<SelectOption[]>([
    { label: intl.messages["app.pages.productimages.nonProduct"], value: null },
    ...getProducts,
  ]);
  const { user } = useSelector((state: RootState) => state.login);
  const [form] = Form.useForm<ProductImagesFormValues>();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

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

  // componentDidMount = useEffect
  useEffect(() => {
    getDataProducts();
    setState((prev) => ({ ...prev, product_id: id }));
  }, [id]);

  const onSubmit = async (Data: ProductImagesFormValues) => {
    if (!Data.arrayImage) {
      return;
    }
    Data.arrayImage.map(async (value) => {
      const { image, ...rest } = value;
      const payload: Record<string, unknown> = {
        ...rest,
        created_user: { name: user.name, id: user.id },
        product_id: Data.product_id,
      };

      if (image?.file?.originFileObj) {
        const formData = new FormData();
        formData.append("image", image.file.originFileObj);

        const dataImage = await axios.post(
          `${API_URL}/upload/uploadproductimage`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        payload.image = dataImage.data.path.replace("/admin/public/", "/");

        axios
          .post(`${API_URL}/productimages/add`, payload)
          .then((res) => {
            if (res.data.variant == "error") {
              message.error(
                intl.messages["app.pages.productimages.notAdded"] +
                  res.data.messagge
              );
            } else {
              message.success(intl.messages["app.pages.productimages.added"]);

              if (id) {
                Router.push("/productimages/list?id=" + id);
              } else {
                Router.push("/productimages/list");
              }
            }
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log(errorInfo);
  };

  return (
    <div>
      <Card
        className="card"
        title={intl.messages["app.pages.productimages.add"]}
      >
        <Form
          form={form}
          name="add"
          onFinishFailed={onFinishFailed}
          onFinish={onSubmit}
          fields={fields}
          scrollToFirstError
          {...formItemLayout}
        >
          <Form.Item
            name="product_id"
            label={intl.messages["app.pages.common.category"]}
          >
            <Select
              style={{ width: "100%" }}
              value={state.product_id ?? undefined}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              options={dataProducts as unknown as { label: string; value: string }[]}
              placeholder={intl.messages["app.pages.common.pleaseSelect"]}
              onChange={(newValue) => {
                setState({
                  ...state,
                  product_id: typeof newValue === "string" ? newValue : undefined,
                });
              }}
            />
          </Form.Item>
          <Form.List name="arrayImage">
            {(fields, { add }) => (
              <>
                {fields.map((field, i) => (
                  <div className="grid grid-cols-12 " key={i}>
                    <div className="col-span-3"></div>
                    <Form.Item
                      label={intl.messages["app.pages.common.order"]}
                      initialValue={1 + i}
                      className="col-span-3"
                      name={[field.name, "order"]}
                      rules={[
                        {
                          required: true,
                          message: intl.messages["app.pages.common.pleaseFill"],
                        },
                      ]}
                    >
                      <InputNumber style={{ width: 200 }} />
                    </Form.Item>

                    <Form.Item
                      name={[field.name, "title"]}
                      label={intl.messages["app.pages.common.title"]}
                      className="col-span-3"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name={[field.name, "image"]}
                      label={intl.messages["app.pages.common.image"]}
                      className="col-span-3"
                    >
                      <Upload
                        maxCount={1}
                        beforeUpload={(file) => {
                          const isJPG =
                            file.type === "image/jpeg" ||
                            file.type === "image/png" ||
                            file.type === "image/jpg" ||
                            file.type === "image/gif";
                          if (!isJPG) {
                            message.error(
                              intl.messages["app.pages.common.onlyImage"]
                            );
                            setDisplaySave(false);
                            return false;
                          } else {
                            setDisplaySave(true);

                            return true;
                          }
                        }}
                        showUploadList={{
                          removeIcon: (
                            <DeleteOutlined
                              onClick={() => setDisplaySave(true)}
                            />
                          ),
                        }}
                      >
                        <Button icon={<UploadOutlined />}>
                          <IntlMessages id="app.pages.common.selectFile" />{" "}
                        </Button>
                      </Upload>
                    </Form.Item>
                  </div>
                ))}

                <Form.Item className="float-right">
                  <Button
                    className="float-right"
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    icon={<PlusOutlined />}
                  >
                    <IntlMessages id="app.pages.common.addItem" />
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider />
          <Form.Item className="float-right">
            <Button type="primary" htmlType="submit" disabled={!displaySave}>
              <IntlMessages id="app.pages.common.save" />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

Default.getInitialProps = async ({ req }: NextPageContext) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const getDataProducts = await axios.get(`${API_URL}/products`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });
    const getDataProductsManipulate: SelectOption[] = [];
    if (getDataProducts.data.length > 0) {
      getDataProducts.data.forEach((item: ProductRef) => {
        getDataProductsManipulate.push({
          label: item.title ?? "",
          value: item._id,
        });
      });
    }
    return { getProducts: getDataProductsManipulate };
  }
};

export default Default;
