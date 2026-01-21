import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, IMG_URL } from "@root/config";
import router from "next/router";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Upload,
  Image,
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

type HomeSliderItem = {
  _id?: string;
  categories_id?: string;
  order?: number;
  title?: string;
  description?: string;
  link?: string;
  image?: string;
};

type HomeSliderFormValues = {
  categories_id?: string;
  order?: number;
  title?: string;
  description?: string;
  link?: string;
  image?: UploadChangeParam<UploadFile>;
};

type HomeSliderEditProps = {
  getData?: HomeSliderItem;
  getCategories?: TreeOption[];
};

const normalizeTreeOptions = (options: TreeOption[] = []): TreeOption[] =>
  options.map((option) => ({
    ...option,
    value: option.value ?? undefined,
    children: option.children ? normalizeTreeOptions(option.children) : undefined,
  }));

const Default: NextPage<HomeSliderEditProps> = ({
  getData = {},
  getCategories = [],
}) => {
  const intl = useIntl();
  const [state, setState] = useState<HomeSliderItem>(getData);
  const [dataCategories, setDataCategories] = useState<TreeOption[]>(
    normalizeTreeOptions([
      { label: intl.messages["app.pages.category.rootCategory"], value: undefined },
      ...getCategories,
    ])
  );
  const [displaySave, setDisplaySave] = useState(true);
  const [fields, setFields] = useState<FieldData[]>(
    Object.entries(getData).map(([name, value]) => ({ name, value }))
  );
  const [form] = Form.useForm<HomeSliderFormValues>();
  const { id } = router.query;
  const homeSliderId = Array.isArray(id) ? id[0] : id;

  function getDataFc() {
    if (!homeSliderId) {
      return;
    }
    axios.get(`${API_URL}/homeslider/${homeSliderId}`).then((response) => {
      setState(response.data);
      setFields(
        Object.entries(response.data).map(([name, value]) => ({ name, value }))
      );
    });
  }

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

  const onSubmit = async (Data: HomeSliderFormValues) => {
    if (!homeSliderId) {
      return;
    }
    const { image, ...rest } = Data;
    const payload: Record<string, unknown> = { ...rest };

    if (image?.file?.originFileObj) {
      axios.post(`${API_URL}/upload/deletehomesliderimage`, {
        path: state.image,
      });
      const formData = new FormData();
      formData.append("image", image.file.originFileObj);
      const dataImage = await axios.post(
        `${API_URL}/upload/uploadhomesliderimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      payload.image = dataImage.data.path.replace("/admin/public/", "/");
    }

    axios
      .post(`${API_URL}/homeslider/${homeSliderId}`, payload)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.homeSlider.notUpdated"] + res.data.messagge
          );
        } else {
          message.success(intl.messages["app.pages.homeSlider.updated"]);
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
      <Card
        className="card"
        title={intl.messages["app.pages.homeSlider.update"]}
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
            name="categories_id"
            label={intl.messages["app.pages.common.category"]}
          >
            <TreeSelect
              style={{ width: "100%" }}
              value={
                typeof state.categories_id === "string"
                  ? state.categories_id
                  : undefined
              }
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              treeData={dataCategories}
              placeholder={intl.messages["app.pages.common.pleaseSelect"]}
              showSearch
              treeDefaultExpandAll
              treeNodeFilterProp="title"
              onChange={(newValue) => {
                const normalizedValue =
                  typeof newValue === "string" ? newValue : undefined;
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
                <IntlMessages id="app.pages.common.selectFile" />
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="image"
            label={intl.messages["app.pages.common.uploatedImage"]}
          >
            {state.image ? (
              <Image src={IMG_URL + state.image} width={200} />
            ) : (
              ""
            )}
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

    const getData = await axios.get(API_URL + "/homeslider/" + query.id, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });
    const getDataManipulate = getData.data;

    return {
      getData: getDataManipulate,
      getCategories: getDataCategoriesManipulate,
    };
  }
};

export default Default;
