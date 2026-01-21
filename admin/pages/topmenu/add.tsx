import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "@root/config";
import dynamic from "next/dynamic";
import router from "next/router";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import {
  Switch,
  TreeSelect,
  InputNumber,
  Button,
  Card,
  message,
  Divider,
  Form,
  Input,
} from "antd";
import func from "@app/util/helpers/func";

import { useIntl } from "react-intl";
import IntlMessages from "@app/util/IntlMessages";
import type { NextPage, NextPageContext } from "next";
import type { FormInstance, TreeSelectProps } from "antd";
import type { RootState } from "@app/redux/reducers";

type FieldData = {
  name: string | number | (string | number)[];
  value?: unknown;
};

type TreeOption = {
  label?: string;
  value: string | undefined;
  children?: TreeOption[];
};

type TopMenuFormValues = {
  categories_id?: string;
  order?: number;
  title?: string;
  description_short?: string;
  description?: string;
  seo?: string;
  link?: string;
  visible?: boolean;
  created_user?: { name?: string; id?: string };
};

type TopMenuAddProps = {
  getCategories?: TreeOption[];
};

const Default: NextPage<TopMenuAddProps> = ({ getCategories = [] }) => {
  const Editor = dynamic(() => import("@app/app/components/Editor/index")) as (
    props: { value?: string; form: FormInstance }
  ) => JSX.Element;
  const intl = useIntl();
  const [state, setState] = useState<TopMenuFormValues>({
    categories_id: undefined,
  });
  const fields: FieldData[] = Object.entries(state).map(([name, value]) => ({
    name,
    value,
  }));
  const [dataCategories, setDataCategories] = useState<TreeOption[]>([
    { label: intl.messages["app.pages.topmenu.rootCategory"], value: undefined },
    ...getCategories,
  ]);
  const { user } = useSelector((state: RootState) => state.login);
  const [form] = Form.useForm<TopMenuFormValues>();

  const getDataCategory = () => {
    axios
      .get(`${API_URL}/topmenu`)
      .then((res) => {
        if (res.data.length > 0) {
          const data = func.getCategoriesTreeOptions(res.data) as TreeOption[];
          const treeData = Array.isArray(data) ? data : [];
          treeData.unshift({
            label: intl.messages["app.pages.topmenu.rootCategory"],
            value: undefined,
          });

          setDataCategories(treeData);
        }
      })
      .catch((err) => console.log(err));
  };
  // componentDidMount = useEffect
  useEffect(() => {
    getDataCategory();
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

  const onSubmit = (Data: TopMenuFormValues) => {
    Data["created_user"] = { name: user.name, id: user.id };

    axios
      .post(`${API_URL}/topmenu/add`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.topmenu.notAdded"] + res.data.messagge
          );
        } else {
          message.success(intl.messages["app.pages.topmenu.added"]);

          router.push("/topmenu/list");
        }
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log(errorInfo);
  };

  return (
    <div>
      <Card className="card" title={intl.messages["app.pages.topmenu.add"]}>
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
            name="categories_id"
            label={intl.messages["app.pages.common.category"]}
          >
            <TreeSelect
              style={{ width: "100%" }}
              value={state.categories_id ?? undefined}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              treeData={dataCategories}
              placeholder={intl.messages["app.pages.common.pleaseSelect"]}
              showSearch
              treeDefaultExpandAll
              treeNodeFilterProp="title"
              onChange={(newValue) => {
                setState({
                  ...state,
                  categories_id:
                    typeof newValue === "string"
                      ? newValue
                      : undefined,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="order"
            label={intl.messages["app.pages.common.order"]}
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
            <Input
              onChange={(e) => {
                setState({
                  ...state,
                  title: e.target.value,
                  seo: func.replaceSeoUrl(e.target.value),
                });
              }}
            />
          </Form.Item>

          <Form.Item
            name="description_short"
            label={intl.messages["app.pages.common.descriptionShort"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="description"
            label={intl.messages["app.pages.common.description"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Editor value={state.description ?? ""} form={form} />
          </Form.Item>

          <Form.Item name="seo" label="Seo Url">
            <Input />
          </Form.Item>
          <Form.Item
            name="link"
            label={intl.messages["app.pages.topmenu.otherLink"]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="visible"
            label={intl.messages["app.pages.common.visible"]}
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked
            />
          </Form.Item>

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

Default.getInitialProps = async ({ req }: NextPageContext) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const getDataCategories = await axios.get(`${API_URL}/topmenu`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });
    const getDataCategoriesManipulate: TreeOption[] = [
      { label: "▣ Root Category ", value: undefined },
    ];
    if (getDataCategories.data.length > 0) {
      const treeData = func.getCategoriesTreeOptions(
        getDataCategories.data
      ) as TreeOption[];
      if (Array.isArray(treeData)) {
        getDataCategoriesManipulate.push(...treeData);
      }
    }
    return { getCategories: getDataCategoriesManipulate };
  }
};

export default Default;
