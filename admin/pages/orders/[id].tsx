import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@root/config";
import router from "next/router";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Table,
  Popconfirm,
  Radio,
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
import Price from "@app/app/components/Price";
import { useIntl } from "react-intl";
import IntlMessages from "@app/util/IntlMessages";

type FieldData = {
  name: string | number | (string | number)[];
  value?: unknown;
};

type SelectOption = {
  label: string;
  value: string | null;
};

type AddressEntry = {
  name: string;
  address: string;
  village_id?: string;
  district_id?: string;
  town_id?: string;
  city_id?: string;
};

type CustomerItem = {
  _id: string;
  name: string;
  surname: string;
  username: string;
  phone: string;
  prefix: string;
  address: AddressEntry[];
};

type VariantProduct = {
  price: number;
  before_price: number;
  qty: number | string;
  visible?: boolean;
  [key: string]: unknown;
};

type ProductItem = {
  _id: string;
  seo: string;
  title: string;
  type?: boolean;
  categories_id?: string;
  price: number;
  before_price: number;
  variants?: { name: string; value: string[] }[];
  variant_products?: VariantProduct[];
  selectedVariants?: Record<string, string>;
  qty?: number;
};

type CargoItem = {
  _id: string;
  title: string;
  price: number;
};

type OrderFormState = {
  products: ProductItem[];
  discount_price: number;
  total_price: number;
  cargo_price: number;
  cargo_discount_price: number;
  cargoes_id?: string | null;
  customer_id?: string | null;
  billing_address?: string;
  shipping_address?: string;
  payment_intent?: string;
  orderstatus_id?: string;
  paymentmethods_id?: string;
};

type OrderFormValues = {
  orderstatus_id: string;
  paymentmethods_id: string;
  cargoes_id: string;
  customer_id?: string | null;
  receiver_name: string;
  receiver_email: string;
  receiver_phone: string;
  billing_address: string;
  shipping_address: string;
};

const Default = () => {
  const intl = useIntl();
  const { id } = router.query;
  const [state, setState] = useState<OrderFormState>({
    products: [],
    discount_price: 0,
    total_price: 0,
    cargo_price: 0,
    cargo_discount_price: 0,
  });
  const [fields, setFields] = useState<FieldData[]>([]);
  const [customerdata, setCustomerdata] = useState<SelectOption[]>([]);
  const [customerdataAll, setCustomerdataAll] = useState<CustomerItem[]>([]);
  const [customerSingle, setCustomerSingle] = useState<CustomerItem | null>(
    null
  );
  const [paymentMethodsData, setPaymentMethodsData] = useState<SelectOption[]>([]);
  const [orderStatus, setOrderStatus] = useState<SelectOption[]>([]);
  const [allCargoes, setAllCargoes] = useState<CargoItem[]>([]);
  const [cargoes, setCargoes] = useState<SelectOption[]>([]);
  const [billingAddress, setBillingAddress] = useState<SelectOption[]>([]);
  const [shippingAddress, setShippingAddress] = useState<SelectOption[]>([]);
  const [productsData, setProductsData] = useState<SelectOption[]>([]);
  const [productDataAll, setProductDataAll] = useState<ProductItem[]>([]);
  const [productsAdd, setProductsAdd] = useState<ProductItem | null>(null);
  const [priceAdd, setPriceAdd] = useState({
    before_price: 0,
    price: 0,
    qty: 1,
  });

  const [form] = Form.useForm();

  function getDataFc(orderId: string) {
    axios.get<OrderFormState>(`${API_URL}/orders/${orderId}`).then((response) => {
      setState(response.data);
      setFields(
        Object.entries(response.data).map(([name, value]) => ({ name, value }))
      );
    });
  }

  // componentDidMount = useEffect
  useEffect(() => {
    if (typeof id === "string") {
      getDataFc(id);
    }
    getDataOrderStatusFc();
    getDataCustomersFc();
    getDataPaymentMethodsFc();
    getDataCargoesFc();
    getDataProductsFc();
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

  const onSubmit = async (Data: OrderFormValues) => {
    const payload = {
      ...Data,
      products: state.products,
      discount_price: state.discount_price,
      total_price: state.total_price,
      cargo_price: state.cargo_price,
      cargo_discount_price: state.cargo_discount_price,
    };

    axios
      .post(`${API_URL}/orders/${id}`, payload)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.orders.notUpdated"] + res.data.messagge
          );
        } else {
          message.success(intl.messages["app.pages.orders.updated"]);

          router.push("/orders/list");
        }
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log(errorInfo);
  };

  const getDataCustomersFc = () => {
    axios
      .get(API_URL + "/customers")
      .then((res) => {
        if (res.data.length > 0) {
          const dataManipulate: SelectOption[] = [{ label: "Guest", value: null }];
          const customers = res.data as CustomerItem[];
          for (const i in customers) {
            dataManipulate.push({
              label: customers[i].name + " " + customers[i].surname,
              value: customers[i]._id,
            });
          }

          setCustomerdata(dataManipulate);
          setCustomerdataAll(customers);
        }
      })
      .catch((err) => console.log(err));
  };
  const getDataProductsFc = () => {
    axios
      .get(API_URL + "/products")
      .then((res) => {
        if (res.data.length > 0) {
          const dataManipulate: SelectOption[] = [];
          const products = res.data as ProductItem[];
          for (const i in products) {
            dataManipulate.push({
              label: products[i].title,
              value: products[i]._id,
            });
          }

          setProductsData(dataManipulate);
          setProductDataAll(products);
        }
      })
      .catch((err) => console.log(err));
  };
  const getDataPaymentMethodsFc = () => {
    axios
      .get(API_URL + "/paymentmethods")
      .then((res) => {
        if (res.data.length > 0) {
          const dataManipulate: SelectOption[] = [];
          const methods = res.data as Array<{ _id: string; title: string }>;
          for (const i in methods) {
            dataManipulate.push({
              label: methods[i].title,
              value: methods[i]._id,
            });
          }

          setPaymentMethodsData(dataManipulate);
        }
      })
      .catch((err) => console.log(err));
  };
  const getDataCargoesFc = () => {
    axios
      .get(API_URL + "/cargoes")
      .then((res) => {
        if (res.data.length > 0) {
          const dataManipulate: SelectOption[] = [];
          const items = res.data as CargoItem[];
          for (const i in items) {
            dataManipulate.push({
              label: items[i].title,
              value: items[i]._id,
            });
          }

          setCargoes(dataManipulate);
          setAllCargoes(items);
        }
      })
      .catch((err) => console.log(err));
  };
  const getDataOrderStatusFc = () => {
    axios
      .get(API_URL + "/orderstatus")
      .then((res) => {
        if (res.data.length > 0) {
          const dataManipulate: SelectOption[] = [];
          const statuses = res.data as Array<{ _id: string; title: string }>;
          for (const i in statuses) {
            dataManipulate.push({
              label: statuses[i].title,
              value: statuses[i]._id,
            });
          }

          setOrderStatus(dataManipulate);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Card className="card" title={intl.messages["app.pages.orders.add"]}>
        <Form
          {...formItemLayout}
          form={form}
          name="add"
          onFinishFailed={onFinishFailed}
          onFinish={onSubmit}
          fields={fields}
          scrollToFirstError
        >
          <Form.Item name="ordernumber" label={"No"}>
            <Input readOnly bordered={false} />
          </Form.Item>
          {state.payment_intent ? (
            <Form.Item
              name="payment_intent"
              label={"Stripe Payment Intent Key"}
            >
              <Input readOnly bordered={false} />
            </Form.Item>
          ) : (
            ""
          )}
          <Divider />
          <Form.Item
            name="orderstatus_id"
            label={intl.messages["app.pages.orders.status"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseSelect"],
                whitespace: true,
              },
            ]}
          >
          <Select
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            options={orderStatus as unknown as { label: string; value: string }[]}
            placeholder={intl.messages["app.pages.common.pleaseSelect"]}
            showSearch
            filterOption={(input, option) => {
              const value =
                typeof option?.value === "string" ? option.value : "";
              const label =
                typeof option?.label === "string" ? option.label : "";
              return (
                value.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            onChange={(newValue) => {
              const selectedValue =
                typeof newValue === "string" ? newValue : undefined;
              setState({ ...state, orderstatus_id: selectedValue });
            }}
          />
          </Form.Item>

          <Divider />

          <Form.Item
            name="paymentmethods_id"
            label={intl.messages["app.pages.orders.paymentMethod"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseSelect"],
                whitespace: true,
              },
            ]}
          >
          <Select
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            options={
              paymentMethodsData as unknown as { label: string; value: string }[]
            }
            placeholder={intl.messages["app.pages.common.pleaseSelect"]}
            showSearch
            filterOption={(input, option) => {
              const value =
                typeof option?.value === "string" ? option.value : "";
              const label =
                typeof option?.label === "string" ? option.label : "";
              return (
                value.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            onChange={(newValue) => {
              const selectedValue =
                typeof newValue === "string" ? newValue : undefined;
              setState({ ...state, paymentmethods_id: selectedValue });
            }}
          />
          </Form.Item>

          <Form.Item
            name="cargoes_id"
            label={intl.messages["app.pages.orders.cargo"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseSelect"],
                whitespace: true,
              },
            ]}
          >
          <Select
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            options={cargoes as unknown as { label: string; value: string }[]}
            placeholder={intl.messages["app.pages.common.pleaseSelect"]}
            showSearch
            filterOption={(input, option) => {
              const value =
                typeof option?.value === "string" ? option.value : "";
              const label =
                typeof option?.label === "string" ? option.label : "";
              return (
                value.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            onChange={(newValue) => {
              const selectedValue =
                typeof newValue === "string" ? newValue : undefined;
              setState({ ...state, cargoes_id: selectedValue });
              const cargoesPrice = allCargoes.find(
                (val) => val._id == selectedValue
              );
              setState({
                ...state,
                cargo_price: cargoesPrice ? Number(cargoesPrice.price) : 0,
              });
            }}
          />
          </Form.Item>
          <Form.Item
            name="customer_id"
            label={intl.messages["app.pages.orders.customer"]}
          >
          <Select
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            options={customerdata as unknown as { label: string; value: string }[]}
            placeholder={intl.messages["app.pages.common.pleaseSelect"]}
            showSearch
            filterOption={(input, option) => {
              const value =
                typeof option?.value === "string" ? option.value : "";
              const label =
                typeof option?.label === "string" ? option.label : "";
              return (
                value.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            onChange={(newValue) => {
              const selectedValue =
                typeof newValue === "string" ? newValue : null;
              if (selectedValue != null) {
                setState({ ...state, customer_id: selectedValue });
                const data = customerdataAll.find(
                  (x) => x._id === selectedValue
                );
                setCustomerSingle(data ?? null);

                const dataManipulate: SelectOption[] = [];
                const customerAddress = data?.address || [];
                for (const i in customerAddress) {
                  dataManipulate.push({
                    label:
                      customerAddress[i].name +
                      " -" +
                      customerAddress[i].address +
                      " " +
                      customerAddress[i].village_id +
                      " " +
                      customerAddress[i].district_id +
                      " " +
                      customerAddress[i].town_id +
                      " " +
                      customerAddress[i].city_id,
                    value:
                      customerAddress[i].address +
                      " " +
                      customerAddress[i].village_id +
                      " " +
                      customerAddress[i].district_id +
                      " " +
                      customerAddress[i].town_id +
                      " " +
                      customerAddress[i].city_id,
                  });
                }
                setBillingAddress(dataManipulate);
                setShippingAddress(dataManipulate);
                setFields(
                  Object.entries({
                    receiver_name: data?.name + " " + data?.surname,
                    receiver_email: data?.username,
                    receiver_phone: `${data?.prefix || ""}${data?.phone || ""}`,
                  }).map(([name, value]) => ({ name, value }))
                );
              }
            }}
          />
          </Form.Item>

          <Form.Item
            name="receiver_name"
            label={intl.messages["app.pages.orders.receiverName"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseSelect"],
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="receiver_email"
            label={intl.messages["app.pages.orders.receiverEmail"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseSelect"],
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="receiver_phone"
            label={intl.messages["app.pages.orders.receiverPhone"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseSelect"],
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col sm={12}>
              <Form.Item
                label={intl.messages["app.pages.orders.selectBillingAddress"]}
                labelAlign="left"
                labelCol={{ span: 20 }}
                wrapperCol={{ span: 24 }}
              >
                <Select
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  options={
                    billingAddress as unknown as { label: string; value: string }[]
                  }
                  placeholder={intl.messages["app.pages.common.pleaseSelect"]}
                  showSearch
                  filterOption={(input, option) => {
                    const value =
                      typeof option?.value === "string" ? option.value : "";
                    const label =
                      typeof option?.label === "string" ? option.label : "";
                    return (
                      value.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                      label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(newValue) => {
                    const selectedValue =
                      typeof newValue === "string" ? newValue : undefined;
                    setState({ ...state, billing_address: selectedValue });
                    setFields(
                      Object.entries({
                        ...fields,
                        billing_address: selectedValue,
                      }).map(([name, value]) => ({ name, value }))
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                label={intl.messages["app.pages.orders.selectShippingAddress"]}
                labelAlign="left"
                labelCol={{ span: 20 }}
                wrapperCol={{ span: 24 }}
              >
                <Select
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  options={
                    shippingAddress as unknown as { label: string; value: string }[]
                  }
                  placeholder={intl.messages["app.pages.common.pleaseSelect"]}
                  showSearch
                  filterOption={(input, option) => {
                    const value =
                      typeof option?.value === "string" ? option.value : "";
                    const label =
                      typeof option?.label === "string" ? option.label : "";
                    return (
                      value.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                      label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(newValue) => {
                    const selectedValue =
                      typeof newValue === "string" ? newValue : undefined;
                    setState({ ...state, shipping_address: selectedValue });
                    setFields(
                      Object.entries({
                        ...fields,
                        shipping_address: selectedValue,
                      }).map(([name, value]) => ({ name, value }))
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                name="billing_address"
                label={intl.messages["app.pages.orders.billingAddress"]}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: intl.messages["app.pages.common.pleaseSelect"],
                    whitespace: true,
                  },
                ]}
              >
                <Input.TextArea
                  onChange={(newValue) => {
                    setState({
                      ...state,
                      billing_address: newValue.target.value,
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                name="shipping_address"
                label={intl.messages["app.pages.orders.shippingAddress"]}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: intl.messages["app.pages.common.pleaseSelect"],
                    whitespace: true,
                  },
                ]}
              >
                <Input.TextArea
                  onChange={(newValue) => {
                    setState({
                      ...state,
                      shipping_address: newValue.target.value,
                    });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Divider />
          <Form.Item
            name="product_data"
            label={intl.messages["app.pages.orders.selectProducts"]}
          >
          <Select
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            options={productsData as unknown as { label: string; value: string }[]}
            placeholder={intl.messages["app.pages.common.pleaseSelect"]}
            showSearch
            filterOption={(input, option) => {
              const value =
                typeof option?.value === "string" ? option.value : "";
              const label =
                typeof option?.label === "string" ? option.label : "";
              return (
                value.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            onChange={(newValue) => {
              const selectedProduct = productDataAll.find(
                (x) => x._id == newValue
              );
              if (!selectedProduct) {
                return;
              }
              selectedProduct.qty = Number(1);
              setProductsAdd(selectedProduct);
              setPriceAdd({
                qty: selectedProduct.qty,
                price: selectedProduct.price * selectedProduct.qty,
                before_price: selectedProduct.before_price * selectedProduct.qty,
              });
            }}
          />
          </Form.Item>

          <>
            {productsAdd?.title ? (
              <Row gutter={[16, 16]}>
                <Col sm={6}>
                  <label>
                    <IntlMessages id="app.pages.common.title" />: <br />
                  </label>

                  <Input
                    onChange={(x) => {
                      setProductsAdd({ ...productsAdd, title: x.target.value });
                    }}
                    value={productsAdd.title}
                  />
                </Col>
                <Col sm={10}>
                  {productsAdd.type ? (
                    <>
                      <label>
                        <IntlMessages id="app.pages.common.variants" />: <br />
                      </label>

                    {productsAdd.variants?.map((x, index) => (
                      <div key={index}>
                        <Form.Item
                          name={x.name}
                            label={x.name}
                            labelAlign="left"
                            rules={[
                              {
                                required: true,
                                message:
                                  intl.messages[
                                    "app.pages.common.pleaseSelect"
                                  ],
                                whitespace: true,
                              },
                            ]}
                          >
                            <Radio.Group
                              name={x.name}
                              options={
                                x.value as unknown as {
                                  label: string;
                                  value: string;
                                }[]
                              }
                              optionType="button"
                              buttonStyle="solid"
                              onChange={(x) => {
                              const data = productsAdd;
                              const variantName =
                                typeof x.target.name === "string"
                                  ? x.target.name
                                  : String(x.target.name);
                              data.selectedVariants = {
                                ...data.selectedVariants,
                                [variantName]: x.target.value,
                              };

                              const priceMath = func.filter_array_in_obj(
                                data.variant_products || [],
                                data.selectedVariants || {}
                              );

                              setProductsAdd(data);
                              setProductsAdd({
                                ...productsAdd,
                                price: priceMath[0].price,
                                before_price: priceMath[0].before_price,
                              });

                              setPriceAdd({
                                qty: priceAdd.qty,
                                price: priceMath[0].price * priceAdd.qty,
                                before_price:
                                  priceMath[0].before_price * priceAdd.qty,
                              });
                              }}
                            />
                        </Form.Item>
                      </div>
                    ))}
                    </>
                  ) : (
                    ""
                  )}
                </Col>
                <Col sm={2}>
                  <label>
                    <IntlMessages id="app.pages.common.qty" />: <br />
                  </label>
                  <div>
                    <Input
                      type="number"
                      onChange={(x) => {
                        setPriceAdd({
                          qty: Number(x.target.value),
                          price: productsAdd.price * Number(x.target.value),
                          before_price:
                            productsAdd.before_price * Number(x.target.value),
                        });
                      }}
                      value={priceAdd.qty}
                    />
                  </div>
                </Col>
                <Col sm={2}>
                  <label>
                    <IntlMessages id="app.pages.common.price" />: <br />
                  </label>
                  <div>
                    <Input value={priceAdd.price} />
                    {priceAdd.before_price != 0 ? (
                      <div>
                        {" "}
                        <IntlMessages id="app.pages.common.beforePrice" />:
                        <span style={{ textDecoration: "line-through" }}>
                          {priceAdd.before_price}
                        </span>{" "}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </Col>
                <Col sm={2}>
                  <Button
                    type="primary"
                    className="mt-4"
                    onClick={() => {
                      form
                        .validateFields()
                        .then(() => {
                          const data = state.products;

                          data.push({
                            _id: productsAdd._id,
                            seo: productsAdd.seo,
                            title: productsAdd.title,
                            selectedVariants: productsAdd.selectedVariants,
                            type: productsAdd.type,
                            categories_id: productsAdd.categories_id,
                            price: priceAdd.price,
                            qty: priceAdd.qty,
                            before_price: priceAdd.before_price,
                          });

                        let total_price = 0;
                        let discount_price = 0;

                          data.forEach((val) => {
                            total_price =
                              Number(val.price) * Number(val.qty) + total_price;
                            discount_price =
                              Number(val.before_price) * Number(val.qty) +
                              discount_price;
                          });

                          setState({
                            ...state,
                            products: data,
                            total_price,
                            discount_price,
                          });
                          setFields(
                            Object.entries({
                              ...fields,
                              products: data,
                              total_price,
                              discount_price,
                            }).map(([name, value]) => ({ name, value }))
                          );

                          setPriceAdd({ before_price: 0, price: 0, qty: 1 });

                        if (productsAdd.type && productsAdd.selectedVariants) {
                          const variantSetUndefined: Record<string, undefined> = {};
                          Object.keys(productsAdd.selectedVariants).forEach(
                            function (key) {
                              variantSetUndefined[key] = undefined;
                            }
                          );
                          form.setFieldsValue(variantSetUndefined);
                        }

                          form.setFieldsValue({
                            product_data: undefined,
                          });

                          setProductsAdd(null);
                        })
                        .catch((err) => console.log("err", err));
                    }}
                  >
                    <IntlMessages id="app.pages.common.addItem" />
                  </Button>
                </Col>

                <Divider />
              </Row>
            ) : (
              ""
            )}
          </>
          <Divider />

          <Table
            columns={[
              {
                title: intl.messages["app.pages.common.title"],
                dataIndex: "title",
                key: "title",
                render: (text) => <span className="link">{text}</span>,
              },
              {
                title: intl.messages["app.pages.common.selectedVariants"],
                dataIndex: "selectedVariants",
                key: "selectedVariants",
                render: (text, record) => {
                  const variants: JSX.Element[] = [];

                  if (record.selectedVariants) {
                    for (const property in record.selectedVariants) {
                      variants.push(
                        <div key={property}>
                          {property}: {record.selectedVariants[property]}
                        </div>
                      );
                    }
                  }
                  return variants.length > 1 ? variants : "Single Product";
                },
              },
              {
                title: intl.messages["app.pages.common.qty"],
                dataIndex: "qty",
                key: "qty",
                render: (text) => text,
              },
              {
                title: intl.messages["app.pages.common.price"],
                dataIndex: "price",
                key: "price",
                render: (text) => text.toLocaleString(),
              },
              {
                title: intl.messages["app.pages.common.action"],
                dataIndex: "action",
                key: "action",
                render: (text, record) => (
                  <Popconfirm
                    placement="left"
                    title={intl.messages["app.pages.common.sureToDelete"]}
                    onConfirm={() => {
                      let filteredArray = state.products.filter(
                        (item) => item !== record
                      );
                      let total_price = 0;
                      let discount_price = 0;

                      filteredArray.forEach((val) => {
                        total_price = Number(val.price) + total_price;
                        discount_price =
                          Number(val.before_price) + discount_price;
                      });
                      setState({
                        ...state,
                        products: filteredArray,
                        total_price,
                        discount_price,
                      });
                    }}
                  >
                    <a>
                      <DeleteOutlined
                        style={{ fontSize: "150%", marginLeft: "15px" }}
                      />{" "}
                    </a>
                  </Popconfirm>
                ),
              },
            ]}
            pagination={false}
            dataSource={[...state.products]}
            rowKey="_id"
          />
          <table className=" w-64 mt-4 float-right text-right">
            <tr className="text-md">
              <td>
                <IntlMessages id="app.pages.common.price" />
              </td>
              <td>:</td>
              <td>
                <Price data={state.total_price} />
              </td>
            </tr>
            <tr className="text-md">
              <td>
                <IntlMessages id="app.pages.orders.cargo" />
              </td>
              <td>:</td>
              <td>
                <Price data={state.cargo_price} />
              </td>
            </tr>
            <tr className="text-lg">
              <td>
                <IntlMessages id="app.pages.orders.totalPrice" />
              </td>
              <td>:</td>
              <td>
                <Price data={state.total_price + state.cargo_price} />
              </td>
            </tr>
          </table>

          <div style={{ clear: "both" }}></div>
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
