import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "@root/config";
import router from "next/router";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Space,
  InputNumber,
  Button,
  Card,
  message,
  Divider,
  Col,
  Form,
  Input,
  Row,
} from "antd";
import { useIntl } from "react-intl";
import IntlMessages from "@app/util/IntlMessages";
import type { RootState } from "@app/redux/reducers";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

type FieldData = {
  name: string | number | (string | number)[];
  value?: unknown;
};

type ApiItem = {
  name?: string;
  value?: string;
};

type PaymentMethodFormValues = {
  order: number;
  title: string;
  contract: string;
  public_key: string;
  secret_key: string;
  api?: ApiItem[];
  image?: UploadChangeParam<UploadFile>;
  created_user?: { name?: string; id?: string };
};

const Default = () => {
  const intl = useIntl();
  const fields: FieldData[] = Object.entries({}).map(([name, value]) => ({
    name,
    value,
  }));
  const { user } = useSelector((state: RootState) => state.login);
  const [form] = Form.useForm<PaymentMethodFormValues>();

  // componentDidMount = useEffect
  useEffect(() => {}, []);

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

  const onSubmit = async (Data: PaymentMethodFormValues) => {
    const { image, ...rest } = Data;
    const payload: Record<string, unknown> = {
      ...rest,
      created_user: { name: user.name, id: user.id },
    };

    if (image?.file?.originFileObj) {
      const formData = new FormData();
      formData.append("image", image.file.originFileObj);

      const dataImage = await axios.post(
        `${API_URL}/upload/uploadpaymentmethodsimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      payload.image = dataImage.data.path.replace("/admin/public/", "/");
    } else {
      payload.image = "";
    }

    axios
      .post(`${API_URL}/paymentmethods/add`, payload)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.paymentMethods.notAdded"] +
            res.data.messagge
          );
        } else {
          message.success(intl.messages["app.pages.paymentMethods.added"]);

          router.push("/paymentmethods/list");
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
        title={intl.messages["app.pages.paymentMethods.add"]}
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
            name="contract"
            label={intl.messages["app.pages.common.contract"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="public_key"
            label={intl.messages["app.pages.common.publicKey"]}
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
            name="secret_key"
            label={intl.messages["app.pages.common.secretKey"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Divider />
          <Row>
            <Col md={12} sm={0} />
            <Col md={12} sm={24}>
              <Form.List name="api">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <Space
                        key={field.key}
                        style={{
                          display: "flex-start",
                          alignItems: "flex-start",
                          marginBottom: 8,
                        }}
                        align="baseline"
                      >
                        <Form.Item
                          {...field}
                          label={intl.messages["app.pages.paymentMethods.name"]}
                          className="float-left"
                          name={[field.name, "name"]}
                          fieldKey={[field.fieldKey, "name"]}
                          rules={[
                            {
                              required: true,
                              message:
                                intl.messages["app.pages.common.pleaseFill"],
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          className="float-left"
                          label={
                            intl.messages["app.pages.paymentMethods.Value"]
                          }
                          name={[field.name, "value"]}
                          fieldKey={[field.fieldKey, "value"]}
                          rules={[
                            {
                              required: true,
                              message:
                                intl.messages["app.pages.common.pleaseFill"],
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item className="float-left">
                          <Button
                            type="primary"
                            shape="circle"
                            onClick={() => remove(field.name)}
                            icon={<DeleteOutlined />}
                          />
                        </Form.Item>
                      </Space>
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
                        <IntlMessages id="app.pages.paymentMethods.apiValue" />
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>

          <Divider />
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              <IntlMessages id="app.pages.common.save" />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Default;
