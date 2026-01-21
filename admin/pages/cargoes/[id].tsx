import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, IMG_URL } from "@root/config";
import router from "next/router";
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

type CargoItem = {
  _id: string;
  title?: string;
  order?: number;
  image?: string;
  isActive?: boolean;
  price?: number;
  before_price?: number;
  link?: string;
};

type CargoFormValues = CargoItem & { image?: UploadChangeParam<UploadFile> };

type CargoEditProps = {
  getData?: CargoItem;
};

const Default: NextPage<CargoEditProps> = ({ getData }) => {
  const intl = useIntl();
  const [state, setState] = useState<CargoItem>(getData || ({} as CargoItem));
  const [displaySave, setDisplaySave] = useState(true);
  const fields = Object.entries(state).map(([name, value]) => ({
    name,
    value,
  }));
  const [form] = Form.useForm();
  const { id } = router.query;

  function getDataFc(cargoId: string) {
    axios.get<CargoItem>(`${API_URL}/cargoes/${cargoId}`).then((response) => {
      setState(response.data);
    });
  }
  // componentDidMount = useEffect
  useEffect(() => {
    if (typeof id === "string") {
      getDataFc(id);
    }
  }, [id]);

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

  const onSubmit = async (Data: CargoFormValues) => {
    const { image, ...rest } = Data;
    const payload: Record<string, unknown> = { ...rest };

    if (image?.file?.originFileObj) {
      axios.post(`${API_URL}/upload/deletecargoimage`, { path: state.image });

      const formData = new FormData();
      formData.append("image", image.file.originFileObj);

      const dataImage = await axios.post(
        `${API_URL}/upload/uploadcargoimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      payload.image = dataImage.data.path.replace("/admin/public/", "/");
    }

    axios
      .post(`${API_URL}/cargoes/${id}`, payload)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.cargoes.notUpdated"] + res.data.messagge
          );
        } else {
          message.success(intl.messages["app.pages.cargoes.updated"]);

          router.push("/cargoes/list");
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
        title={intl.messages["app.pages.cargoes.cargoCompanyEdit"]}
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
            name="isActive"
            label={intl.messages["app.pages.common.visible"]}
            initialValue={true}
          >
            <Select
              style={{ width: "100%" }}
              options={([
                {
                  label: intl.messages["app.pages.common.beActive"],
                  value: true,
                },
                {
                  label: intl.messages["app.pages.common.bePassive"],
                  value: false,
                },
              ] as unknown as { label: string; value: string }[])}
              placeholder={intl.messages["app.pages.common.pleaseSelect"]}
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
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label={intl.messages["app.pages.common.price"]}
            {...formItemLayout}
            initialValue={0}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label={intl.messages["app.pages.common.beforePrice"]}
            {...formItemLayout}
            name="before_price"
            initialValue={0}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="link"
            label={intl.messages["app.pages.cargoes.searchLink"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
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
                  message.error(intl.messages["app.pages.brands.onlyImage"]);
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
            <Image src={IMG_URL + (state.image || "")} width={200} />
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
    const getData = await axios.get(API_URL + "/cargoes/" + query.id, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });
    const getDataManipulate = getData.data;

    return { getData: getDataManipulate };
  }
};

export default Default;
