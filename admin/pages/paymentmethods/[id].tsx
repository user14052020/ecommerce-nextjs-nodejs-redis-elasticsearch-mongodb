import { useState, useEffect } from "react";
import axios from "axios";
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
import type { NextPage, NextPageContext } from "next";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

type FieldData = {
  name: string | number | (string | number)[];
  value?: unknown;
};

type ApiItem = {
  name?: string;
  value?: string;
};

type PaymentMethodItem = {
  _id?: string;
  order?: number;
  title?: string;
  contract?: string;
  public_key?: string;
  secret_key?: string;
  api?: ApiItem[];
  image?: string;
};

type PaymentMethodFormValues = {
  order?: number;
  title?: string;
  contract?: string;
  public_key?: string;
  secret_key?: string;
  api?: ApiItem[];
  image?: UploadChangeParam<UploadFile>;
};

type PaymentMethodsEditProps = {
  getData?: PaymentMethodItem;
};

const Default: NextPage<PaymentMethodsEditProps> = ({ getData = {} }) => {
  const intl = useIntl();
  const [state, setState] = useState<PaymentMethodItem>(getData);
  const fields: FieldData[] = Object.entries(state).map(([name, value]) => ({
    name,
    value,
  }));
  const [form] = Form.useForm<PaymentMethodFormValues>();
  const { id } = router.query;
  const paymentMethodId = Array.isArray(id) ? id[0] : id;

  function getDataFc() {
    if (!paymentMethodId) {
      return;
    }
    axios.get(`${API_URL}/paymentmethods/${paymentMethodId}`).then((response) => {
      setState(response.data);
    });
  }
  // componentDidMount = useEffect
  useEffect(() => {
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

  const onSubmit = async (Data: PaymentMethodFormValues) => {
    if (!paymentMethodId) {
      return;
    }
    const { image, ...rest } = Data;
    const payload: Record<string, unknown> = { ...rest };

    if (image?.file?.originFileObj) {
      axios.post(`${API_URL}/upload/deletepaymentmethodsimage`, {
        path: state.image,
      });

      const formData = new FormData();
      formData.append("image", image.file.originFileObj);

      const dataImage = await axios.post(
        `${API_URL}/upload/uploadpaymentmethodsimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      payload.image = dataImage.data.path.replace("/admin/public/", "/");
    }

    axios
      .post(`${API_URL}/paymentmethods/${paymentMethodId}`, payload)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.paymentMethods.notUpdated"] +
              res.data.messagge
          );
        } else {
          message.success(intl.messages["app.pages.paymentMethods.updated"]);

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
        title={intl.messages["app.pages.paymentMethods.update"]}
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

Default.getInitialProps = async ({ req, query }: NextPageContext) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const getData = await axios.get(API_URL + "/paymentmethods/" + query.id, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });
    const getDataManipulate = getData.data;

    return { getData: getDataManipulate };
  }
};

export default Default;
