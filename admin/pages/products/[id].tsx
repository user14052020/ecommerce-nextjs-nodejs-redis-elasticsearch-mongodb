import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@root/config";
import router from "next/router";
import dynamic from "next/dynamic";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Tag,
  TreeSelect,
  InputNumber,
  Button,
  Card,
  message,
  Divider,
  Col,
  Form,
  Input,
  Row,
  Select,
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
  value?: string;
  children?: TreeOption[];
  disabled?: boolean;
};

type SelectOption = {
  label: string;
  value: string;
};

type BrandItem = {
  _id: string;
  title?: string;
};

type VariantValue = {
  name: string;
  value: string;
};

type VariantDefinition = {
  name: string;
  variants: VariantValue[];
};

type VariantOptionsState = {
  options: SelectOption[];
  data: VariantDefinition[];
};

type VariantValueOptionsState = {
  options: SelectOption[][];
};

type VariantMetaField = {
  key: string;
  initialValue: string;
  display?: boolean;
  label?: string;
  fieldKey?: string | number;
};

type ProductFormValues = {
  categories_id?: string;
  order?: number;
  title?: string;
  description_short?: string;
  description?: string;
  seo?: string;
  visible?: boolean;
  before_price?: number;
  price?: number;
  qty?: number;
  saleqty?: number;
  brands_id?: string;
  type?: boolean;
  variants?: { name?: string; value?: string[] }[];
  variant_products?: Record<string, unknown>[];
  isActive?: boolean;
};

type ProductsEditProps = {
  getCategories?: TreeOption[];
  getData?: ProductFormValues;
};

const normalizeTreeOptions = (options: TreeOption[] = []): TreeOption[] =>
  options.map((option) => ({
    ...option,
    value: option.value ?? undefined,
    children: option.children ? normalizeTreeOptions(option.children) : undefined,
  }));

const Default: NextPage<ProductsEditProps> = ({
  getCategories = [],
  getData = {},
}) => {
  const Editor = dynamic(() => import("@app/app/components/Editor/index")) as (
    props: { value?: string; form: FormInstance }
  ) => JSX.Element;
  const intl = useIntl();
  const [form] = Form.useForm<ProductFormValues>();
  const [state, setState] = useState<ProductFormValues>(getData);
  const [fields, setFields] = useState<FieldData[]>(
    Object.entries(getData).map(([name, value]) => ({ name, value }))
  );
  const [dataCategories, setDataCategories] = useState<TreeOption[]>(
    normalizeTreeOptions(getCategories)
  );
  const [dataVariants, setDataVariants] = useState<VariantOptionsState>({
    options: [],
    data: [],
  });
  const [dataBrands, setDataBrands] = useState<SelectOption[]>([]);
  const [variantsOp, setVariantsOp] = useState<VariantValueOptionsState>({
    options: [],
  });
  const [meta, setMeta] = useState<VariantMetaField[][]>([]);
  const { id } = router.query;
  const productId = Array.isArray(id) ? id[0] : id;

  async function getDataFc() {
    if (!productId) {
      return;
    }
    await axios
      .get(`${API_URL}/products/${productId}`)
      .then((response) => {
        const output = {
          ...response.data,
          categories_id:
            typeof response.data.categories_id === "string"
              ? response.data.categories_id
              : undefined,
        } as ProductFormValues;
        setState(output);
        setFields(
          Object.entries(output).map(([name, value]) => ({ name, value }))
        );
      })
      .then(() => {
        setTimeout(() => {
          selectVariants();
        }, 1);
      });
  }

  const selectBeforeVariants = async (variantsData: VariantDefinition[]) => {
    const formData = form.getFieldsValue() as ProductFormValues;
    const variant = formData.variants ?? [];

    const datas = variantsOp.options;

    for (const i in variant) {
      const dataVariant = variantsData.filter(
        (item) => item.name === variant[i]?.name
      );

      const dataManipulate =
        dataVariant[0]?.variants.map((item) => ({
          label: item.name,
          value: item.value,
        })) ?? [];
      datas[i] = dataManipulate;

      setVariantsOp({ options: datas });
    }

    setVariantsOp({ options: datas });
  };
  // componentDidMount = useEffect
  useEffect(() => {
    getDataFc();
    getDataCategory();
    getDataVariants();
    getDataBrands();
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

  const onSubmit = (Data: ProductFormValues) => {
    if (!productId) {
      return;
    }
    axios
      .post(`${API_URL}/products/${productId}`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.product.notUpdated"] + res.data.messagge
          );
        } else {
          message.success(intl.messages["app.pages.product.updated"]);

          router.push("/products/list");
        }
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log(errorInfo);
  };

  const getDataCategory = () => {
    axios
      .get(`${API_URL}/categories`)
      .then((res) => {
        if (res.data.length > 0) {
          const data = func.getCategoriesTreeOptions(
            res.data,
            true
          ) as TreeOption[];
          setDataCategories(
            normalizeTreeOptions(Array.isArray(data) ? data : [])
          );
        }
      })
      .catch((err) => console.log(err));
  };

  const getDataBrands = () => {
    axios
      .get(`${API_URL}/brands`)
      .then((res) => {
        if (res.data.length > 0) {
          const dataManipulate = res.data.map((item: BrandItem) => ({
            label: item.title ?? "",
            value: item._id,
          }));

          setDataBrands(dataManipulate);
        }
      })
      .catch((err) => console.log(err));
  };

  const getDataVariants = () => {
    axios
      .get(`${API_URL}/variants`)
      .then((res) => {
        if (res.data.length > 0) {
          const details = res.data.map((item: VariantDefinition) => ({
            label: item.name,
            value: item.name,
          }));
          setDataVariants({ options: details, data: res.data });

          setTimeout(() => {
            selectBeforeVariants(res.data);
          }, 1);
        }
      })
      .catch((err) => console.log(err));
  };

  const getProducts = (arrays: string[][]): string[][] => {
    if (arrays.length === 0) {
      return [[]];
    }

    let results: string[][] = [];

    getProducts(arrays.slice(1)).forEach((product) => {
      arrays[0].forEach((value) => {
        results.push([value].concat(product));
      });
    });

    return results;
  };

  const getAllCombinations = (attributes: Record<string, string[]>) => {
    const attributeNames = Object.keys(attributes);

    const attributeValues = attributeNames.map((name) => attributes[name]);

    return getProducts(attributeValues).map((product) => {
      const obj: Record<string, string> = {};
      attributeNames.forEach((name, i) => {
        obj[name] = product[i];
      });
      return obj;
    });
  };

  const selectVariants = () => {
    const formData = form.getFieldsValue() as ProductFormValues;

    const varib: Record<string, string[]> = {};
    if (formData.variants && formData.variants.length > 0) {
      if (formData.variants[0] !== undefined) {
        for (const i in formData.variants) {
          const varib2: string[] = [];

          const values = formData.variants[i]?.value ?? [];
          for (const j in values) {
            varib2.push(values[j]);
          }

          if (formData.variants[i]?.name) {
            varib[formData.variants[i].name as string] = varib2;
          }
        }
      }
      const objToArr = getAllCombinations(varib);
      const DataS: VariantMetaField[][] = [];
      for (const i in objToArr) {
        const variantsP = Object.entries(objToArr[i]).map(
          ([key, initialValue]) => ({ key, initialValue })
        );

        DataS.push(variantsP);
      }
      setMeta(DataS);
    } else {
      setMeta([]);
    }
  };

  return (
    <div>
      <Form
        {...formItemLayout}
        form={form}
        name="add"
        onFinishFailed={onFinishFailed}
        onFinish={onSubmit}
        fields={fields}
        scrollToFirstError
      >
        <Card className="card" title={intl.messages["app.pages.product.edit"]}>
          <Form.Item
            label={intl.messages["app.pages.common.salesqty"]}
            name="saleqty"
            initialValue={0}
          >
            <Input readOnly bordered={false} />
          </Form.Item>

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
            <Editor form={form} />
          </Form.Item>

          <Form.Item name="seo" label="Seo Url" initialValue={state.seo}>
            <Input />
          </Form.Item>

          <Form.Item
            name="brands_id"
            label={intl.messages["app.pages.common.brands"]}
          >
            <Select
              style={{ width: "100%" }}
              options={dataBrands}
              placeholder={intl.messages["app.pages.common.pleaseSelect"]}
            />
          </Form.Item>
          <Divider />
          <Form.Item
            name="type"
            label={intl.messages["app.pages.product.productType"]}
          >
            <Select
              style={{ width: "100%" }}
              options={([
                {
                  label: intl.messages["app.pages.product.simple"],
                  value: false,
                },
                {
                  label: intl.messages["app.pages.product.variant"],
                  value: true,
                },
              ] as unknown as { label: string; value: string }[])}
              placeholder={intl.messages["app.pages.common.pleaseSelect"]}
              onChange={(newValue) => {
                setState({ ...state, type: Boolean(newValue) });
              }}
            />
          </Form.Item>
        </Card>

        <Card
          className="card"
          style={{ display: state.type ? "" : "none" }}
          title={intl.messages["app.pages.product.productType"]}
        >
          <div style={{ width: "100%" }}>
            <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, i) => (
                  <Row className="float-left w-full " key={i} gutter={[8, 8]}>
                    <Col xs={8}>
                      <Form.Item
                        {...field}
                        {...formItemLayout}
                        className="float-left w-full  mx-0 px-0"
                        name={[field.name, "name"]}
                        label={intl.messages["app.pages.common.variants"]}
                        fieldKey={[field.fieldKey, "variants"]}
                        hasFeedback
                        rules={[
                          {
                            message:
                              intl.messages["app.pages.common.confirmPassword"],
                          },
                          ({ getFieldValue }) => ({
                            validator(rule, value) {
                              const variants =
                                (getFieldValue("variants") as Array<{
                                  name?: string;
                                }>) || [];
                              const item = variants.filter(
                                (x: { name?: string }) => x.name === value
                              );

                              if (!value || item.length <= 1) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                intl.messages["app.pages.common.duplicate"]
                              );
                            },
                          }),
                        ]}
                      >
                        <Select
                          showSearch
                          options={dataVariants.options}
                          placeholder={
                            intl.messages["app.pages.common.searchVariant"]
                          }
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toString()
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          onChange={(selected) => {
                            const dataVariant = dataVariants.data.filter(
                              (x) => x.name === selected
                            );
                            const dataManipulate =
                              dataVariant[0]?.variants.map((item) => ({
                                label: item.name,
                                value: item.value,
                              })) ?? [];
                            const datas = variantsOp.options;

                            datas[i] = dataManipulate;

                            setVariantsOp({
                              options: datas,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={15}>
                      <Form.Item
                        {...field}
                        {...formItemLayout}
                        className="float-left w-full  mx-0 px-0"
                        label={intl.messages["app.pages.common.values"]}
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
                        <Select
                          showSearch
                          mode="multiple"
                          showArrow
                          options={variantsOp.options[i] ?? []}
                          placeholder="Search Variant Name"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toString()
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          onChange={() => {
                            selectVariants();
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={1}>
                      <Form.Item className="float-left">
                        <Button
                          type="primary"
                          shape="circle"
                          onClick={() => {
                            remove(field.name);
                            selectVariants();
                          }}
                          icon={<DeleteOutlined />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
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
                    <IntlMessages id="app.pages.common.addVariant" />
                  </Button>
                </Form.Item>
                <Divider />
              </>
            )}
            </Form.List>
          </div>
          <Form.List name="variant_products">
            {() => (
              <>
                {meta.map((field, i) => (
                  <Form.List name={i} key={i}>
                    {() => (
                      <>
                        {field.map((field2, j) => (
                          <div className="float-left" key={j}>
                            <div className="float-left w-full">
                              <h5 className="float-left text-xl pr-2">
                                {j == 0
                                  ? intl.messages["app.pages.common.variants"]
                                  : ""}
                              </h5>
                              {field2.display == true ? (
                                ""
                              ) : (
                                <Tag color="blue" className="float-left">
                                  {field2.initialValue}
                                </Tag>
                              )}
                            </div>
                            <Form.Item
                              style={{
                                display: field2.display == true ? "" : "none",
                              }}
                              {...field2}
                              label={field2.label}
                              {...formItemLayout}
                              className="float-left w-full  mx-0 px-0"
                              name={field2.key}
                              fieldKey={field2.fieldKey}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    intl.messages[
                                    "app.pages.common.pleaseFill"
                                    ],
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </div>
                        ))}

                        <Form.Item
                          label={intl.messages["app.pages.common.price"]}
                          {...formItemLayout}
                          className="float-left w-full  mx-0 px-0"
                          name="price"
                          initialValue={1}
                          rules={[
                            {
                              required: true,
                              message:
                                intl.messages["app.pages.common.pleaseFill"],
                            },
                          ]}
                        >
                          <InputNumber className="!w-1/2" />
                        </Form.Item>

                        <Form.Item
                          label={intl.messages["app.pages.common.beforePrice"]}
                          {...formItemLayout}
                          className="float-left w-full  mx-0 px-0"
                          name="before_price"
                          initialValue={0}
                          rules={[
                            {
                              required: true,
                              message:
                                intl.messages["app.pages.common.pleaseFill"],
                            },
                          ]}
                        >
                          <InputNumber className="!w-1/2" />
                        </Form.Item>

                        <Form.Item
                          label={intl.messages["app.pages.common.qty"]}
                          {...formItemLayout}
                          className="float-left w-full  mx-0 px-0"
                          name="qty"
                          initialValue={100}
                          rules={[
                            {
                              required: true,
                              message:
                                intl.messages["app.pages.common.pleaseFill"],
                            },
                          ]}
                        >
                          <InputNumber className="!w-1/2" />
                        </Form.Item>
                        <Form.Item
                          label={intl.messages["app.pages.common.salesqty"]}
                          name="saleqty"
                          className="float-left w-full  mx-0 px-0"
                          initialValue={0}
                        >
                          <Input readOnly className=" !w-1/5" />
                        </Form.Item>

                        <Form.Item
                          name="visible"
                          label={intl.messages["app.pages.common.visible"]}
                          className="float-left w-full  mx-0 px-0"
                          initialValue={true}
                        >
                          <Select
                            className=" !w-1/5"
                            options={([
                              {
                                label:
                                  intl.messages["app.pages.common.beActive"],
                                value: true,
                              },
                              {
                                label:
                                  intl.messages["app.pages.common.bePassive"],
                                value: false,
                              },
                            ] as unknown as { label: string; value: string }[])}
                            placeholder={
                              intl.messages["app.pages.common.pleaseSelect"]
                            }
                          />
                        </Form.Item>

                        <Divider />
                      </>
                    )}
                  </Form.List>
                ))}
                <Divider />
              </>
            )}
          </Form.List>
        </Card>
        <Card className="card" style={{ display: state.type ? "none" : "" }}>
          <Form.Item
            name="before_price"
            label={intl.messages["app.pages.common.beforePrice"]}
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
            name="price"
            label={intl.messages["app.pages.common.price"]}
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
            name="qty"
            label={intl.messages["app.pages.common.qty"]}
            initialValue={100}
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
            name="isActive"
            label={intl.messages["app.pages.common.visible"]}
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
        </Card>

        <Card className="card">
          <Form.Item className="float-right">
            <Button type="primary" htmlType="submit">
              <IntlMessages id="app.pages.common.save" />
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
};

Default.getInitialProps = async ({ req, query }: NextPageContext) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const getData = await axios.get(API_URL + "/products/" + query.id, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    const getDataCategories = await axios.get(`${API_URL}/categories`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });
    const getDataCategoriesManipulate: TreeOption[] = [];
    if (getDataCategories.data.length > 0) {
      const treeData = func.getCategoriesTreeOptions(
        getDataCategories.data,
        true
      ) as TreeOption[];
      if (Array.isArray(treeData)) {
        getDataCategoriesManipulate.push(...normalizeTreeOptions(treeData));
      }
    }
    return {
      getData: getData.data,
      getCategories: getDataCategoriesManipulate,
    };
  }
};

export default Default;
