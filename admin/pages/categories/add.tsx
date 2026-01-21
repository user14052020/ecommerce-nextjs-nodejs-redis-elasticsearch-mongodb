import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "@root/config";
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
import type { RootState } from "@app/redux/reducers";
import type { TreeSelectProps } from "antd";

type CategoryOption = {
  label?: string;
  title?: string;
  value?: string;
  children?: CategoryOption[];
};

type CategoryFormValues = {
  categories_id?: string | null;
  order: number;
  title: string;
  description: string;
  seo?: string;
  link?: string;
  visible?: boolean;
  created_user?: { name?: string; id?: string };
};

type CategoriesAddProps = {
  getCategories?: CategoryOption[];
};

const normalizeCategoryOptions = (
  options: CategoryOption[] = []
): CategoryOption[] =>
  options.map((option) => ({
    ...option,
    value: option.value ?? undefined,
    children: option.children
      ? normalizeCategoryOptions(option.children)
      : undefined,
  }));

const Default: NextPage<CategoriesAddProps> = ({ getCategories = [] }) => {
  const intl = useIntl();
  const [state, setState] = useState<Partial<CategoryFormValues>>({
    categories_id: undefined,
  });
  const fields = Object.entries(state).map(([name, value]) => ({
    name,
    value,
  }));
  const [dataCategories, setDataCategories] = useState<CategoryOption[]>(
    normalizeCategoryOptions([
      {
        label: intl.messages["app.pages.category.rootCategory"],
        value: undefined,
      },
      ...getCategories,
    ])
  );
  const { user } = useSelector((state: RootState) => state.login);
  const [form] = Form.useForm();

  const getDataCategory = () => {
    axios
      .get(`${API_URL}/categories`)
      .then((res) => {
        if (res.data.length > 0) {
          const data = func.getCategoriesTreeOptions(res.data) as
            | CategoryOption[]
            | undefined;
          const normalized = normalizeCategoryOptions(data || []);
          normalized.unshift({
            label: intl.messages["app.pages.category.rootCategory"],
            value: undefined,
          });
          setDataCategories(normalized);
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

  const onSubmit = (Data: CategoryFormValues) => {
    Data["created_user"] = { name: user.name, id: user.id };

    axios
      .post(`${API_URL}/categories/add`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.category.notAdded"] + res.data.messagge
          );
        } else {
          message.success(intl.messages["app.pages.category.added"]);

          router.push("/categories/list");
        }
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log(errorInfo);
  };

  return (
    <div>
      <Card className="card" title={intl.messages["app.pages.category.add"]}>
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
              placeholder="Please select"
              showSearch
              treeDefaultExpandAll
              treeNodeFilterProp="title"
              onChange={(newValue) => {
                setState({
                  ...state,
                  categories_id: typeof newValue === "string" ? newValue : undefined,
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
            name="description"
            label={intl.messages["app.pages.common.description"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="seo" label="Seo Url">
            <Input value={state.seo} />
          </Form.Item>
          <Form.Item
            name="link"
            label={intl.messages["app.pages.category.otherLink"]}
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
    const getDataCategories = await axios.get(`${API_URL}/categories`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });
    const getDataCategoriesManipulate: CategoryOption[] = [
      { label: "▣ Root Category ", value: undefined },
    ];
    if (getDataCategories.data.length > 0) {
      const options = func.getCategoriesTreeOptions(getDataCategories.data) as
        | CategoryOption[]
        | undefined;
      if (options) {
        getDataCategoriesManipulate.push(...options);
      }
    }
    return { getCategories: getDataCategoriesManipulate };
  }
};

export default Default;
