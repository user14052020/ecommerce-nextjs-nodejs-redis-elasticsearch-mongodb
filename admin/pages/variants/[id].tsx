import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@root/config";
import { useRouter } from "next/router";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Space,
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
import type { NextPage } from "next";

type FieldData = {
  name: string | number | (string | number)[];
  value?: unknown;
};

type VariantValue = {
  name?: string;
  value?: string;
};

type VariantFormValues = {
  name?: string;
  description?: string;
  variants?: VariantValue[];
};

const Default: NextPage = () => {
  const intl = useIntl();
  const [state, setState] = useState<FieldData[]>([]);
  const [form] = Form.useForm<VariantFormValues>();
  const router = useRouter();
  const { id } = router.query;
  const variantId = Array.isArray(id) ? id[0] : id;

  function getData() {
    if (!variantId) {
      return;
    }
    axios.get(`${API_URL}/variants/${variantId}`).then((response) => {
      var output = Object.entries(response.data).map(([name, value]) => ({
        name,
        value,
      }));

      setState(output);
    });
  }

  // componentDidMount = useEffect
  useEffect(() => {
    getData();
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

  const onSubmit = (Data: VariantFormValues) => {
    if (!variantId) {
      return;
    }
    axios
      .post(`${API_URL}/variants/${variantId}`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.variants.notUpdated"] + res.data.messagge
          );
        } else {
          message.success(intl.messages["app.pages.variants.updated"]);

          router.push("/variants/list");
        }
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log(errorInfo);
  };

  return (
    <div>
      <Card className="card" title={intl.messages["app.pages.variants.edit"]}>
        <Form
          {...formItemLayout}
          form={form}
          name="add"
          onFinishFailed={onFinishFailed}
          onFinish={onSubmit}
          fields={state}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label={intl.messages["app.pages.variants.name"]}
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
            name="description"
            label={intl.messages["app.pages.common.description"]}
          >
            <Input />
          </Form.Item>

          <Divider />
          <Row>
            <Col md={12} sm={0} />
            <Col md={12} sm={24}>
              <Form.List
                name="variants"
                initialValue={[{ name: "", value: "" }]}
              >
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
                          label={intl.messages["app.pages.common.name"]}
                          className="float-left"
                          name={[field.name, "name"]}
                          fieldKey={[field.fieldKey, "name"]}
                          rules={[{ required: true, message: "Missing Area" }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          className="float-left"
                          label={intl.messages["app.pages.common.values"]}
                          name={[field.name, "value"]}
                          fieldKey={[field.fieldKey, "value"]}
                          rules={[{ required: true, message: "Missing Area" }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item className="float-left">
                          {fields.length > 1 ? (
                            <Button
                              type="primary"
                              shape="circle"
                              onClick={() => remove(field.name)}
                              icon={<DeleteOutlined />}
                            />
                          ) : null}
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
                        <IntlMessages id="app.pages.settings.addSights" />
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>

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
