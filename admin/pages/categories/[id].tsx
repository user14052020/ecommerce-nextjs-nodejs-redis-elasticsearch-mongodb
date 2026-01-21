import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@root/config";
import { useRouter } from "next/router";
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
import type { TreeSelectProps } from "antd";

type CategoryItem = {
  _id: string;
  title?: string;
  order?: number;
  description?: string;
  categories_id?: string | null;
  seo?: string;
  link?: string;
  visible?: boolean;
};

type CategoryOption = {
  label?: string;
  title?: string;
  value?: string;
  children?: CategoryOption[];
};

type CategoriesEditProps = {
  getData?: CategoryItem;
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

const Default: NextPage<CategoriesEditProps> = ({
  getData,
  getCategories = [],
}) => {
  const intl = useIntl();
  const [state, setState] = useState<CategoryItem>(getData || ({} as CategoryItem));
  const [fields, setFields] = useState(
    Object.entries(getData || {}).map(([name, value]) => ({ name, value }))
  );
  const [dataCategories, setDataCategories] = useState<CategoryOption[]>(
    normalizeCategoryOptions(getCategories)
  );
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;

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
            title: intl.messages["app.pages.category.rootCategory"],
            value: undefined,
          });
          setDataCategories(normalized);
        }
      })
      .catch((err) => console.log(err));
  };

  function getDataFc(categoryId: string) {
    axios.get<CategoryItem>(`${API_URL}/categories/${categoryId}`).then((response) => {
      setState(response.data);
      setFields(
        Object.entries(response.data).map(([name, value]) => ({ name, value }))
      );
    });
  }
  //componentDidMount = useEffect
  useEffect(() => {
    getDataCategory();
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
  const onSubmit = (Data: CategoryItem) => {
    axios
      .post(`${API_URL}/categories/${id}`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.category.notUpdated"] + res.data.messagge
          );
        } else {
          message.success(intl.messages["app.pages.category.updated"]);

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
      <Card className="card" title={intl.messages["app.pages.category.edit"]}>
        <Form
          {...formItemLayout}
          form={form}
          name="add"
          onFinishFailed={onFinishFailed}
          onFinish={onSubmit}
          scrollToFirstError
          fields={fields}
        >
          <Form.Item
            name="categories_id"
            label={intl.messages["app.pages.common.category"]}
          >
            <TreeSelect
              style={{ width: "100%" }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              treeData={dataCategories}
              placeholder="Please select"
              showSearch
              treeDefaultExpandAll
              treeNodeFilterProp="title"
              onChange={(newValue) => {
                const selectedValue =
                  typeof newValue === "string" ? newValue : null;
                setState({
                  ...state,
                  categories_id: selectedValue,
                });
                setFields(
                  Object.entries({ categories_id: selectedValue }).map(
                    ([name, value]) => ({ name, value })
                  )
                );
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
                setFields(
                  Object.entries({
                    seo: func.replaceSeoUrl(e.target.value),
                  }).map(([name, value]) => ({ name, value }))
                );
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
            <Input />
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

Default.getInitialProps = async ({ req, query }: NextPageContext) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const getData = await axios.get(API_URL + "/categories/" + query.id, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });
    const getDataManipulate = getData.data;

    const getDataCategories = await axios.get(`${API_URL}/categories`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });
    const getDataCategoriesManipulate = func.getCategoriesTreeOptions(
      getDataCategories.data
    ) as CategoryOption[];
    getDataCategoriesManipulate.unshift({
      label: "▣ Root Category ",
      value: undefined,
    });

    return {
      getData: getDataManipulate,
      getCategories: getDataCategoriesManipulate,
    };
  }
};

export default Default;
