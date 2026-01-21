import { useState, useEffect } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { API_URL } from "@root/config";
import { useRouter } from "next/router";

import {
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
import type { FormInstance, TreeSelectProps } from "antd";
import type { NextPage, NextPageContext } from "next";

type FieldData = {
  name: string | number | (string | number)[];
  value?: unknown;
};

type TreeOption = {
  label?: string;
  value: string | undefined;
  children?: TreeOption[];
};

type TopMenuItem = {
  _id?: string;
  categories_id?: string;
  order?: number;
  title?: string;
  description_short?: string;
  description?: string;
  seo?: string;
  link?: string;
};

type TopMenuFormValues = {
  categories_id?: string;
  order?: number;
  title?: string;
  description_short?: string;
  description?: string;
  seo?: string;
  link?: string;
};

type TopMenuEditProps = {
  getData?: TopMenuItem;
  getCategories?: TreeOption[];
};

const Default: NextPage<TopMenuEditProps> = ({
  getData = {},
  getCategories = [],
}) => {
  const Editor = dynamic(() => import("@app/app/components/Editor/index")) as (
    props: { value?: string; form: FormInstance }
  ) => JSX.Element;
  const intl = useIntl();
  const [state, setState] = useState<TopMenuItem>(getData);
  const [fields, setFields] = useState<FieldData[]>(
    Object.entries(getData).map(([name, value]) => ({ name, value }))
  );
  const [dataCategories, setDataCategories] =
    useState<TreeOption[]>(getCategories);
  const [form] = Form.useForm<TopMenuFormValues>();
  const router = useRouter();
  const { id } = router.query;
  const topMenuId = Array.isArray(id) ? id[0] : id;

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

  function getDataFc() {
    if (!topMenuId) {
      return;
    }
    axios.get(`${API_URL}/topmenu/${topMenuId}`).then((response) => {
      setState(response.data);
      setFields(
        Object.entries(response.data).map(([name, value]) => ({ name, value }))
      );
    });
  }

  //componentDidMount = useEffect
  useEffect(() => {
    getDataCategory();
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

  const onSubmit = (Data: TopMenuFormValues) => {
    if (!topMenuId) {
      return;
    }
    axios
      .post(`${API_URL}/topmenu/${topMenuId}`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.topmenu.notUpdated"] + res.data.messagge
          );
        } else {
          message.success(intl.messages["app.pages.topmenu.updated"]);

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
      <Card className="card" title={intl.messages["app.pages.topmenu.edit"]}>
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
              value={state.categories_id ?? undefined}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              treeData={dataCategories}
              placeholder={intl.messages["app.pages.common.pleaseSelect"]}
              showSearch
              treeDefaultExpandAll
              treeNodeFilterProp="title"
              onChange={(newValue) => {
                const normalizedValue =
                  newValue === "0-0" || newValue == null
                    ? undefined
                    : typeof newValue === "string"
                    ? newValue
                    : undefined;
                setState({
                  ...state,
                  categories_id: normalizedValue,
                });
                setFields(
                  Object.entries({ categories_id: normalizedValue }).map(
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
    const getData = await axios.get(API_URL + "/topmenu/" + query.id, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });
    const getDataManipulate = getData.data;

    const getDataCategories = await axios.get(`${API_URL}/topmenu`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });
    const getDataCategoriesManipulate = func.getCategoriesTreeOptions(
      getDataCategories.data
    ) as TreeOption[];
    const treeData = Array.isArray(getDataCategoriesManipulate)
      ? getDataCategoriesManipulate
      : [];
    treeData.unshift({
      label: "▣ Root Category ",
      value: undefined,
    });

    return {
      getData: getDataManipulate,
      getCategories: treeData,
    };
  }
};

export default Default;
