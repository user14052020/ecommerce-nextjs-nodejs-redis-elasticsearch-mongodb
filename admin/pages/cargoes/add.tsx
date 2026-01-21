import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "@root/config";
import router from "next/router";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
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
import type { RootState } from "@app/redux/reducers";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

type CargoFormValues = {
  isActive?: boolean;
  order: number;
  title: string;
  price: number;
  before_price: number;
  link: string;
  image?: UploadChangeParam<UploadFile>;
  created_user?: { name?: string; id?: string };
};

const Default = () => {
  const intl = useIntl();
  const [displaySave, setDisplaySave] = useState(true);
  const fields = Object.entries({}).map(([name, value]) => ({ name, value }));

  const { user } = useSelector((state: RootState) => state.login);
  const [form] = Form.useForm();

  // componentDidMount = useEffect
  useEffect(() => { }, []);

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
    const payload: Record<string, unknown> = {
      ...rest,
      created_user: { name: user.name, id: user.id },
    };

    if (image?.file?.originFileObj) {
      const formData = new FormData();
      formData.append("image", image.file.originFileObj);

      const dataImage = await axios.post(
        `${API_URL}/upload/uploadcargoimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      payload.image = dataImage.data.path.replace("/admin/public/", "/");
    } else {
      payload.image = "";
    }

    axios
      .post(`${API_URL}/cargoes/add`, payload)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.cargoes.notAdded"] + res.data.messagge
          );
        } else {
          message.success(intl.messages["app.pages.cargoes.added"]);

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
        title={intl.messages["app.pages.cargoes.companyAdd"]}
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

export default Default;
