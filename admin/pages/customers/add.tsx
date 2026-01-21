import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "@root/config";
import { useRouter } from "next/router";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
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
import { useIntl } from "react-intl";
import IntlMessages from "@app/util/IntlMessages";
import type { NextPage, NextPageContext } from "next";
import type { RootState } from "@app/redux/reducers";

type FieldData = {
  name: string | number | (string | number)[];
  value?: unknown;
};

type SelectOption = {
  label: string;
  value: string;
};

type CountryState = {
  name: string;
};

type CountryItem = {
  name: string;
  states?: CountryState[];
};

type TurkeyMahalle = {
  Mahalle: string;
};

type TurkeySemt = {
  Semt: string;
  Mahalle: TurkeyMahalle[];
};

type TurkeyIlce = {
  Ilce: string;
  Semt: TurkeySemt[];
};

type TurkeyCity = {
  Il: string;
  Ilce: TurkeyIlce[];
};

type OptionData<T> = {
  option: SelectOption[];
  data: T[];
};

type SelectedAddressState = {
  selectedCountry?: string;
  selectedCity?: string;
  selectedIlce?: string;
  selectedSemt?: string;
  selectedMahalle?: string;
};

type CustomerAddress = {
  type?: boolean;
  name?: string;
  country_id?: string;
  state_id?: string;
  city_id?: string;
  town_id?: string;
  district_id?: string;
  village_id?: string;
  address?: string;
};

type CustomerFormValues = {
  username?: string;
  name?: string;
  surname?: string;
  password?: string;
  confirm?: string;
  phone?: string;
  prefix?: string;
  address?: CustomerAddress[];
  created_user?: { name?: string; id?: string };
};

type CustomersAddProps = {
  dataCityOption?: SelectOption[];
  dataCity?: TurkeyCity[];
};

const Default: NextPage<CustomersAddProps> = ({
  dataCityOption = [],
  dataCity = [],
}) => {
  const intl = useIntl();
  const [city, setCity] = useState<TurkeyCity[]>(dataCity);
  const [country, setCountry] = useState<CountryItem[]>([]);
  const [selectedO, setSelectedO] = useState<SelectedAddressState>({});
  const [cityOption, setCityOption] =
    useState<SelectOption[]>(dataCityOption);
  const [countryOption, setCountryOption] = useState<SelectOption[]>([]);
  const [ilceOption, setIlceOption] = useState<OptionData<TurkeyIlce>>({
    option: [],
    data: [],
  });
  const [semtOption, setSemtOption] = useState<OptionData<TurkeySemt>>({
    option: [],
    data: [],
  });
  const [mahalleOption, setMahalleOption] =
    useState<OptionData<TurkeyMahalle>>({
      option: [],
      data: [],
    });

  const { user } = useSelector((state: RootState) => state.login);
  const [form] = Form.useForm<CustomerFormValues>();
  const router = useRouter();
  const { id } = router.query;

  const [state, setState] = useState({
    username: "",
    name: "",
    surname: "",
    password: "",
    phone: "",
    prefix: "90",
    images: "",
    _id: id,
  });
  const fields: FieldData[] = Object.entries(state).map(([name, value]) => ({
    name,
    value,
  }));

  // componentDidMount = useEffect
  useEffect(() => {
    getCountry();
  }, []);

  const getCity = () => {
    axios.get(`${API_URL}/turkey`).then((getData) => {
      const dataManipulate = getData.data.map((item: TurkeyCity) => ({
        label: item.Il,
        value: item.Il,
      }));
      setCityOption(dataManipulate);
      setCity(getData.data);
    });
  };

  const getCountry = () => {
    axios.get(`${API_URL}/country`).then((getData) => {
      const dataManipulate = getData.data.map((item: CountryItem) => ({
        label: item.name,
        value: item.name,
      }));
      setCountryOption(dataManipulate);
      setCountry(getData.data);
    });
  };

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

  const formItemLayout2 = {
    labelCol: {
      sm: { span: 24 },
      xs: { span: 24 },
    },
    wrapperCol: {
      sm: { span: 24 },
      xs: { span: 24 },
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

  const changePrefix = (selected: string) => {
    setState({
      ...state,
      prefix: selected,
    });
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select onChange={changePrefix} style={{ width: 70 }}>
        <Select.Option value="90">+90</Select.Option>
      </Select>
    </Form.Item>
  );

  const onSubmit = (Data: CustomerFormValues) => {
    Data["created_user"] = { name: user.name, id: user.id };

    axios
      .post(`${API_URL}/customers/add`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            intl.messages["app.pages.customers.notAdded"] + res.data.messagge
          );
        } else {
          const customersUpdate = res.data;

          customersUpdate["created_user"] = {
            name: res.data.data.name + " " + res.data.data.surname,
            id: res.data.data._id,
          };

          axios
            .post(`${API_URL}/customers/${res.data.data._id}`, customersUpdate)
            .then((res) => {
              if (res.data.variant == "error") {
                message.error(
                  intl.messages["app.pages.customers.notAdded"] +
                    res.data.messagge
                );
              } else {
                message.success(intl.messages["app.pages.customers.added"]);

                router.push("/customers/list");
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  const onChangeNameValue = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log(errorInfo);
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
        <Row>
          <Col md={24}>
            <Card
              className="card"
              title={intl.messages["app.pages.customers.add"]}
            >
              <Form.Item
                name="username"
                label={intl.messages["app.pages.common.userName"]}
                rules={[
                  {
                    type: "email",
                    message: intl.messages["app.pages.common.inputNotValid"],
                  },
                  {
                    required: true,
                    message: intl.messages["app.pages.common.inputNotValid"],
                  },
                ]}
              >
                <Input name="username" onChange={onChangeNameValue} />
              </Form.Item>
              <Form.Item
                name="password"
                label={intl.messages["app.pages.common.password"]}
                rules={[
                  {
                    message: intl.messages["app.pages.common.inputNotValid"],
                  },
                ]}
                hasFeedback
              >
                <Input.Password name="password" onChange={onChangeNameValue} />
              </Form.Item>
              <Form.Item
                name="confirm"
                label={intl.messages["app.pages.common.confirmPassword"]}
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    message: intl.messages["app.pages.common.inputNotValid"],
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        intl.messages["app.pages.common.passwordNotMatch"]
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="name"
                label={intl.messages["app.pages.customers.name"]}
                rules={[
                  {
                    required: true,
                    message: intl.messages["app.pages.common.pleaseFill"],
                    whitespace: true,
                  },
                ]}
              >
                <Input name="name" onChange={onChangeNameValue} />
              </Form.Item>
              <Form.Item
                name="surname"
                label={intl.messages["app.pages.customers.surname"]}
                rules={[
                  {
                    required: true,
                    message: intl.messages["app.pages.common.pleaseFill"],
                    whitespace: true,
                  },
                ]}
              >
                <Input name="surname" onChange={onChangeNameValue} />
              </Form.Item>
              <Form.Item
                name="phone"
                label={intl.messages["app.pages.customers.phone"]}
                rules={[
                  {
                    required: true,
                    message: intl.messages["app.pages.common.pleaseFill"],
                  },
                ]}
              >
                <Input
                  name="phone"
                  onChange={onChangeNameValue}
                  addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Divider />
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  <IntlMessages id="app.pages.common.save" />
                </Button>
              </Form.Item>
            </Card>
          </Col>
          <Col md={24}>
            <Card
              className="card w-full"
              title={intl.messages["app.pages.customers.adressAdd"]}
            >
              <div style={{ width: "100%" }}>
                <Form.List name="address">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, i) => (
                      <Row
                        className="float-left w-full "
                        gutter={[8, 8]}
                        key={i}
                      >
                        <Col xs={8}>
                          <Form.Item
                            {...field}
                            {...formItemLayout2}
                            className="float-left  w-full mx-0 px-0"
                            name={[field.name, "name"]}
                            fieldKey={[field.fieldKey, "name"]}
                            rules={[
                              { required: true, message: "Missing Area" },
                            ]}
                          >
                            <Input
                              placeholder={
                                intl.messages["app.pages.customers.addressName"]
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={8}>
                          <Form.Item
                            {...field}
                            {...formItemLayout2}
                            className="float-left  w-full  mx-0 px-0"
                            name={[field.name, "type"]}
                            fieldKey={[field.fieldKey, "type"]}
                            initialValue={true}
                          >
                            <Select
                              options={([
                                { label: "Billing Address", value: true },
                                { label: "Shipping Address", value: false },
                              ] as unknown as { label: string; value: string }[])}
                              placeholder="Select Address Type"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={7}>
                          <Form.Item
                            {...field}
                            {...formItemLayout2}
                            className="float-left  w-full  mx-0 px-0"
                            name={[field.name, "country_id"]}
                            fieldKey={[field.fieldKey, "country_id"]}
                          >
                            <Select
                              showSearch
                              options={countryOption}
                              placeholder="Search to Country"
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              onChange={(selected) => {
                                const selectedValue =
                                  typeof selected === "string" ? selected : "";
                                if (selectedValue === "Turkey") {
                                  getCity();
                                } else {
                                  const citydata = country.filter(
                                    (item) => item.name === selectedValue
                                  );
                                  const states = citydata[0]?.states ?? [];
                                  const dataManipulate = states.map((item) => ({
                                    label: item.name,
                                    value: item.name,
                                  }));

                                  setCityOption(dataManipulate);
                                }
                                setSelectedO({
                                  ...selectedO,
                                  selectedCountry: selectedValue,
                                });
                              }}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={1}>
                          <Form.Item className="float-left">
                            <Button
                              type="primary"
                              shape="circle"
                              onClick={() => remove(field.name)}
                              icon={<DeleteOutlined />}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={6}>
                          <Form.Item
                            {...field}
                            {...formItemLayout2}
                            className="float-left w-full  mx-0 px-0"
                            name={[field.name, "city_id"]}
                            fieldKey={[field.fieldKey, "city_id"]}
                            rules={[
                              { required: true, message: "Missing Area" },
                            ]}
                          >
                            <Select
                              showSearch
                              options={cityOption}
                              placeholder={
                                intl.messages["app.pages.customers.addressCity"]
                              }
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toString()
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              onChange={(selected) => {
                                const selectedValue =
                                  typeof selected === "string" ? selected : "";
                                if (selectedO.selectedCountry === "Turkey") {
                                  const ilce = city.filter(
                                    (item) => item.Il === selectedValue
                                  );
                                  const dataManipulate =
                                    ilce[0]?.Ilce.map((item) => ({
                                      label: item.Ilce,
                                      value: item.Ilce,
                                    })) ?? [];
                                  setSelectedO({
                                    ...selectedO,
                                    selectedCity: selectedValue,
                                  });
                                  setIlceOption({
                                    option: dataManipulate,
                                    data: ilce[0]?.Ilce ?? [],
                                  });
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={6}>
                          <Form.Item
                            {...field}
                            {...formItemLayout2}
                            className="float-left w-full  mx-0 px-0"
                            name={[field.name, "town_id"]}
                            fieldKey={[field.fieldKey, "town_id"]}
                            rules={[
                              { required: true, message: "Missing Area" },
                            ]}
                          >
                            {selectedO.selectedCountry === "Turkey" ? (
                              <Select
                                showSearch
                                options={ilceOption.option}
                                placeholder={
                                  intl.messages[
                                    "app.pages.customers.addressTown"
                                  ]
                                }
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  (option?.label ?? "")
                                    .toString()
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                onChange={(selected) => {
                                  const selectedValue =
                                    typeof selected === "string" ? selected : "";
                                  const data = ilceOption.data.filter(
                                    (item) => item.Ilce === selectedValue
                                  );
                                  const dataManipulate =
                                    data[0]?.Semt.map((item) => ({
                                      label: item.Semt,
                                      value: item.Semt,
                                    })) ?? [];
                                  setSelectedO({
                                    ...selectedO,
                                    selectedIlce: selectedValue,
                                  });
                                  setSemtOption({
                                    option: dataManipulate,
                                    data: data[0]?.Semt ?? [],
                                  });
                                }}
                              />
                            ) : (
                              <Input
                                placeholder={
                                  intl.messages[
                                    "app.pages.customers.addressTown"
                                  ]
                                }
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col xs={6}>
                          <Form.Item
                            {...field}
                            {...formItemLayout2}
                            className="float-left w-full  mx-0 px-0"
                            name={[field.name, "district_id"]}
                            fieldKey={[field.fieldKey, "district_id"]}
                            rules={[
                              { required: true, message: "Missing Area" },
                            ]}
                          >
                            {selectedO.selectedCountry === "Turkey" ? (
                              <Select
                                showSearch
                                options={semtOption.option}
                                placeholder={
                                  intl.messages[
                                    "app.pages.customers.addressDistrict"
                                  ]
                                }
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  (option?.label ?? "")
                                    .toString()
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                onChange={(selected) => {
                                  const selectedValue =
                                    typeof selected === "string" ? selected : "";
                                  const data = semtOption.data.filter(
                                    (item) => item.Semt === selectedValue
                                  );
                                  const dataManipulate =
                                    data[0]?.Mahalle.map((item) => ({
                                      label: item.Mahalle,
                                      value: item.Mahalle,
                                    })) ?? [];
                                  setSelectedO({
                                    ...selectedO,
                                    selectedSemt: selectedValue,
                                  });
                                  setMahalleOption({
                                    option: dataManipulate,
                                    data: data[0]?.Mahalle ?? [],
                                  });
                                }}
                              />
                            ) : (
                              <Input
                                placeholder={
                                  intl.messages[
                                    "app.pages.customers.addressDistrict"
                                  ]
                                }
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col xs={6}>
                          <Form.Item
                            {...field}
                            {...formItemLayout2}
                            className="float-left w-full  mx-0 px-0"
                            name={[field.name, "village_id"]}
                            fieldKey={[field.fieldKey, "village_id"]}
                            rules={[
                              { required: true, message: "Missing Area" },
                            ]}
                          >
                            {selectedO.selectedCountry === "Turkey" ? (
                              <Select
                                showSearch
                                options={mahalleOption.option}
                                placeholder={
                                  intl.messages[
                                    "app.pages.customers.addressNeighbour"
                                  ]
                                }
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  (option?.label ?? "")
                                    .toString()
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                onChange={(selected) => {
                                  const selectedValue =
                                    typeof selected === "string" ? selected : "";
                                  setSelectedO({
                                    ...selectedO,
                                    selectedMahalle: selectedValue,
                                  });
                                }}
                              />
                            ) : (
                              <Input
                                placeholder={
                                  intl.messages[
                                    "app.pages.customers.addressNeighbour"
                                  ]
                                }
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col xs={24}>
                          <Form.Item
                            {...field}
                            {...formItemLayout2}
                            className="float-left w-full  mx-0 px-0"
                            name={[field.name, "address"]}
                            fieldKey={[field.fieldKey, "address"]}
                            rules={[
                              { required: true, message: "Missing Area" },
                            ]}
                          >
                            <Input.TextArea
                              rows={3}
                              placeholder={
                                intl.messages["app.pages.customers.addressFull"]
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Divider />
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
                        <IntlMessages id="app.pages.customers.adressAdd" />
                      </Button>
                    </Form.Item>
                  </>
                )}
                </Form.List>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

Default.getInitialProps = async ({ req }: NextPageContext) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const getData = await axios.get(`${API_URL}/turkey`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    const dataManipulate = getData.data.map((item: TurkeyCity) => ({
      label: item.Il,
      value: item.Il,
    }));

    return { dataCityOption: dataManipulate, dataCity: getData.data };
  }
};

export default Default;
