import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, IMG_URL } from "@root/config";
import Router, { useRouter } from "next/router";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Upload,
  Image,
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
  _id?: string;
  product_id?: string | null;
  order?: number;
  title?: string;
  image?: string;
};

type ProductImageFormValues = {
  product_id?: string | null;
  order?: number;
  title?: string;
  image?: UploadChangeParam<UploadFile>;
};

type ProductImagesEditProps = {
  getProducts?: SelectOption[];
  getData?: ProductImageItem;
};

const Default: NextPage<ProductImagesEditProps> = ({
  getProducts = [],
  getData = {},
}) => {
  const intl = useIntl();
  const [state, setState] = useState<ProductImageItem>(getData);
  const [displaySave, setDisplaySave] = useState(true);
  const fields: FieldData[] = Object.entries(state).map(([name, value]) => ({
    name,
    value,
  }));
  const [dataProducts, setDataProducts] =
    useState<SelectOption[]>(getProducts);
  const [form] = Form.useForm<ProductImageFormValues>();
  const { query } = useRouter();
  const id = typeof query.id === "string" ? query.id : undefined;
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

  function getDataFc() {
    if (!id) {
      return;
    }
    axios.get(`${API_URL}/productimages/${id}`).then((response) => {
      setState(response.data);
    });
  }
  // componentDidMount = useEffect
  useEffect(() => {
    getDataProducts();
    getDataFc();
  }, []);

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
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  const onSubmit = async (Data: ProductImageFormValues) => {
    if (!id) {
      return;
    }
    const { image, ...rest } = Data;
    const payload: Record<string, unknown> = { ...rest };

    if (image?.file?.originFileObj) {
      axios.post(`${API_URL}/upload/deleteproductimage`, { path: state.image });

      const formData = new FormData();
      formData.append("image", image.file.originFileObj);

      const dataImage = await axios.post(
        `${API_URL}/upload/uploadproductimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      payload.image = dataImage.data.path.replace("/admin/public/", "/");
    }

    //Data["image"] = state.image

    axios
      .post(`${API_URL}/productimages/${id}`, payload)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.productimages.notUpdated"] +
              res.data.messagge
          );
        } else {
          message.success(intl.messages["app.pages.productimages.updated"]);

          if (state.product_id) {
            Router.push("/productimages/list?id=" + state.product_id);
          } else {
            Router.push("/productimages/list");
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log(errorInfo);
  };

  return (
    <div>
      <Card
        className="card"
        title={intl.messages["app.pages.productimages.update"]}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="add"
          onFinishFailed={onFinishFailed}
          onFinish={onSubmit}
          fields={fields}
          scrollToFirstError
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
          <Form.Item
            name="order"
            label={intl.messages["app.pages.common.order"]}
            initialValue={0}
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
            name="title"
            label={intl.messages["app.pages.common.title"]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="image"
            label={intl.messages["app.pages.common.image"]}
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
                  message.error(intl.messages["app.pages.common.onlyImage"]);
                  setDisplaySave(false);
                  return false;
                } else {
                  setDisplaySave(true);

                  return true;
                }
              }}
              showUploadList={{
                removeIcon: (
                  <DeleteOutlined onClick={() => setDisplaySave(true)} />
                ),
              }}
            >
              <Button icon={<UploadOutlined />}>
                <IntlMessages id="app.pages.common.selectFile" />
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="image"
            label={intl.messages["app.pages.common.uploatedImage"]}
          >
            {state.image ? (
              <Image src={IMG_URL + state.image} width={200} />
            ) : (
              ""
            )}
          </Form.Item>

          <Divider />
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={!displaySave}>
              <IntlMessages id="app.pages.common.save" />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

Default.getInitialProps = async ({ req, query }: NextPageContext) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const getData = await axios.get(API_URL + "/productimages/" + query.id, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });
    const getDataManipulate = getData.data;

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
    return {
      getData: getDataManipulate,
      getProducts: getDataProductsManipulate,
    };
  }
};

export default Default;
