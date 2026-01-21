import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "@root/config";
import router from "next/router";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Upload,
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
import type { RootState } from "@app/redux/reducers";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

type FieldData = {
  name: string | number | (string | number)[];
  value?: unknown;
};

type TreeOption = {
  label?: string;
  value?: string;
  children?: TreeOption[];
};

type HomeSliderFormValues = {
  categories_id?: string;
  order?: number;
  title?: string;
  description?: string;
  link?: string;
  image?: UploadChangeParam<UploadFile>;
  created_user?: { name?: string; id?: string };
};

type HomeSliderAddProps = {
  getCategories?: TreeOption[];
};

const normalizeTreeOptions = (options: TreeOption[] = []): TreeOption[] =>
  options.map((option) => ({
    ...option,
    value: option.value ?? undefined,
    children: option.children ? normalizeTreeOptions(option.children) : undefined,
  }));

const Default: NextPage<HomeSliderAddProps> = ({ getCategories = [] }) => {
  const intl = useIntl();
  const [state, setState] = useState<HomeSliderFormValues>({
    categories_id: undefined,
  });
  const [dataCategories, setDataCategories] = useState<TreeOption[]>(
    normalizeTreeOptions([
      {
        label: intl.messages["app.pages.category.rootCategory"],
        value: undefined,
      },
      ...getCategories,
    ])
  );
  const [displaySave, setDisplaySave] = useState(true);
  const fields: FieldData[] = Object.entries(state).map(([name, value]) => ({
    name,
    value,
  }));
  const { user } = useSelector((state: RootState) => state.login);
  const [form] = Form.useForm<HomeSliderFormValues>();

  const getDataCategory = () => {
    axios
      .get(`${API_URL}/homeslider`)
      .then((res) => {
        if (res.data.length > 0) {
          const data = func.getCategoriesTreeOptions(res.data) as TreeOption[];
          const treeData = normalizeTreeOptions(Array.isArray(data) ? data : []);
          treeData.unshift({
            label: intl.messages["app.pages.category.rootCategory"],
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

  const onSubmit = async (Data: HomeSliderFormValues) => {
    const { image, ...rest } = Data;
    const payload: Record<string, unknown> = {
      ...rest,
      created_user: { name: user.name, id: user.id },
    };

    if (image?.file?.originFileObj) {
      const formData = new FormData();
      formData.append("image", image.file.originFileObj);

      const dataImage = await axios.post(
        `${API_URL}/upload/uploadhomesliderimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      payload.image = dataImage.data.path.replace("/admin/public/", "/");
    } else {
      payload.image = "";
    }

    axios
      .post(`${API_URL}/homeslider/add`, payload)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.homeSlider.notAdded"] + res.data.messagge
          );
        } else {
          message.success(intl.messages["app.pages.homeSlider.added"]);

          router.push("/homeslider/list");
        }
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log(errorInfo);
  };

  return (
    <div>
      <Card className="card" title={intl.messages["app.pages.homeSlider.add"]}>
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
                    typeof newValue === "string" ? newValue : undefined,
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
            name="description"
            label={intl.messages["app.pages.common.description"]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="link"
            label={intl.messages["app.pages.homeSlider.otherLink"]}
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
                {" "}
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

Default.getInitialProps = async ({ req }: NextPageContext) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const getDataCategories = await axios.get(`${API_URL}/homeslider`, {
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
