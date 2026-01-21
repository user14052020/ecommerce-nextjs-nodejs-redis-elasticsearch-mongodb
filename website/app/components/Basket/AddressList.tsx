import axios from "axios";
import { useState, useEffect } from "react";
import { message, Button, Input, Select, Checkbox, Form, Drawer } from "antd";
import AddressSelect from "@app/app/components/Basket/AddressSelect";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "@root/config";
import { getBasket_r, updateBasket_r } from "@app/redux/actions";
import { useIntl } from "react-intl";
import AuthService from "@app/util/services/authservice";
import type { RootState, AppDispatch } from "@app/redux/store";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { BasketEntry } from "@app/redux/types";

type FieldData = {
   name: string | number | (string | number)[];
   value?: unknown;
};

type AddressEntry = {
   name?: string;
   address?: string;
   country_id?: string;
   city_id?: string;
   town_id?: string;
   village_id?: string;
   district_id?: string;
   [key: string]: unknown;
};

type NewAddressState = {
   open: boolean;
   id: string | null;
};

type OptionItem = {
   label: string;
   value: string;
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

type CountryItem = {
   name: string;
   states: { name: string }[];
};

type OptionWithData<T> = {
   option: OptionItem[];
   data: T[];
};

type SelectedOptions = {
   selectedCountry?: string;
   selectedCity?: string;
   selectedIlce?: string;
   selectedSemt?: string;
   selectedMahalle?: string;
};

const Default = () => {
   const intl = useIntl();

   const { basket } = useSelector((state: RootState) => state.basket);
   const { isAuthenticated, user } = useSelector((state: RootState) => state.login);
   const [fields, setFields] = useState<FieldData[]>([]);

   const [address, setAddress] = useState<AddressEntry[]>([]);

   const [selectedShippingAddress, setSelectedShippingAddress] = useState<
      string | null
   >(null);
   const [selectedBillingAddress, setSelectedBillingAddress] = useState<
      string | null
   >(null);
   const [billingAdressSame, setBillingAdressSame] = useState(true);
   const [newAddress, setNewAddress] = useState<NewAddressState>({
      open: false,
      id: null,
   });

   const [city, setCity] = useState<TurkeyCity[]>([]);
   const [country, setCountry] = useState<CountryItem[]>([]);
   const [selectedO, setSelectedO] = useState<SelectedOptions>({});
   const [cityOption, setCityOption] = useState<OptionItem[]>([]);
   const [countryOption, setCountryOption] = useState<OptionItem[]>([]);
   const [ilceOption, setIlceOption] = useState<OptionWithData<TurkeyIlce>>({
      option: [],
      data: [],
   });
   const [semtOption, setSemtOption] = useState<OptionWithData<TurkeySemt>>({
      option: [],
      data: [],
   });
   const [mahalleOption, setMahalleOption] = useState<
      OptionWithData<TurkeyMahalle>
   >({
      option: [],
      data: [],
   });

   const [form] = Form.useForm();

   const dispatch = useDispatch<AppDispatch>();

   const updateAddress = async (newAddresArr: AddressEntry[]) => {
      if (isAuthenticated) {
         await axios
            .post(`${API_URL}/customerspublic/address`, newAddresArr)
            .then(() => {
               setTimeout(() => {
                  getAddress();
                  setNewAddress({ open: false, id: null });
               }, 500);
            })
            .catch((err) => console.log("err", err));
      } else {
         message.success({ content: "Next Stage :)", duration: 3 });
         setNewAddress({ open: false, id: null });
         setAddress(newAddresArr);
      }
   };

   const updateBasket = async (post: BasketEntry) => {
      const basketRecord = basket[0];
      if (!basketRecord) {
         return;
      }
      if (isAuthenticated) {
         axios
            .post(`${API_URL}/basket/${basketRecord._id}`, post)
            .then(async () => {
               message.success({
                  content: "Address Selected",
                  duration: 3,
               });
               await dispatch(getBasket_r(user.id || null));
            })
            .catch((err) => {
               message.error({
                  content: "Some Error, Please Try Again",
                  duration: 3,
               });
               console.log(err);
            });
      } else {
         message.success({ content: "Next Stage :)", duration: 3 });
         dispatch(updateBasket_r([post]));
      }
   };

   const getCity = () => {
      axios.get<TurkeyCity[]>(`${API_URL}/turkey`).then((getData) => {
         const dataManipulate: OptionItem[] = [];
         for (const i in getData.data) {
            dataManipulate.push({
               label: getData.data[i].Il,
               value: getData.data[i].Il,
            });
         }
         setCityOption(dataManipulate);
         setCity(getData.data);
      });
   };

   const getCountry = () => {
      axios.get<CountryItem[]>(`${API_URL}/country`).then((getData) => {
         const dataManipulate: OptionItem[] = [];
         for (const i in getData.data) {
            dataManipulate.push({
               label: getData.data[i].name,
               value: getData.data[i].name,
            });
         }
         setCountryOption(dataManipulate);
         setCountry(getData.data);
      });
   };

   const getAddress = () => {
      if (isAuthenticated) {
         AuthService.isAuthenticated().then(async (auth) => {
            const authAddress = Array.isArray(auth.user.address)
               ? auth.user.address
               : auth.user.address
               ? [auth.user.address]
               : [];
            await setAddress(authAddress as AddressEntry[]);
         });
      }
   };

   const onSubmitAddress = async (Data: AddressEntry) => {
      if (newAddress.id) {
         const newAddresArr = address.filter(
            (x) => JSON.stringify(x) !== newAddress.id
         );
         newAddresArr.push(Data);
         newAddresArr.reverse();

         updateAddress(newAddresArr);

      } else {
         const newAddresArr = [...address];
         newAddresArr.push(Data);
         newAddresArr.reverse();

         updateAddress(newAddresArr);
      }
   };

   const onFinishFailedAddress = (errorInfo: unknown) => {
      console.log(errorInfo);
   };

   const getSelectedAddress = () => {
      const basketRecord = basket[0];
      if (basketRecord) {
         if (basketRecord.shipping_address) {
            setSelectedShippingAddress(
               JSON.stringify(basketRecord.shipping_address)
            );
         }

         if (basketRecord.billing_address) {
            setSelectedBillingAddress(JSON.stringify(basketRecord.billing_address));
         }

         const stringifBillingAddres = JSON.stringify(basketRecord.billing_address);
         const stringifShippingAddres = JSON.stringify(basketRecord.shipping_address);

         if (stringifBillingAddres != stringifShippingAddres) {
            setBillingAdressSame(false);
         }

      }
   };

   useEffect(() => {
      getCountry();
      getAddress();
      getSelectedAddress();
   }, [basket[0]]);

   const onChanheShppingAddress = (data: string) => {
      const basketRecord = basket[0];
      if (!basketRecord) {
         return;
      }

      if (billingAdressSame) {
         setSelectedShippingAddress(data);
         setSelectedBillingAddress(data);

         const newBasketPost = {
            created_user: {
               name: user.name,
               id: user.id,
            },
            customer_id: user.id,
            products: basketRecord.products,
            cargoes_id: basketRecord.cargoes_id,
            total_price: basketRecord.total_price,
            total_discount: basketRecord.total_discount,
            cargo_price: basketRecord.cargo_price,
            cargo_price_discount: basketRecord.cargo_price_discount,
            shipping_address: JSON.parse(data),
            billing_address: JSON.parse(data),
         };

         updateBasket(newBasketPost);

      } else {
         setSelectedShippingAddress(data);
         const newBasketPost = {
            created_user: {
               name: user.name,
               id: user.id,
            },
            customer_id: user.id,
            products: basketRecord.products,
            cargoes_id: basketRecord.cargoes_id,
            total_price: basketRecord.total_price,
            total_discount: basketRecord.total_discount,
            cargo_price: basketRecord.cargo_price,
            cargo_price_discount: basketRecord.cargo_price_discount,
            shipping_address: JSON.parse(data),
         };

         updateBasket(newBasketPost);

      }
   };

   const onChanheBillingAddress = (data: string) => {
      const basketRecord = basket[0];
      if (!basketRecord || !selectedShippingAddress) {
         return;
      }
      setSelectedBillingAddress(data);

      const newBasketPost = {
         created_user: {
            name: user.name,
            id: user.id,
         },
         customer_id: user.id,
         products: basketRecord.products,
         cargoes_id: basketRecord.cargoes_id,
         total_price: basketRecord.total_price,
         total_discount: basketRecord.total_discount,
         cargo_price: basketRecord.cargo_price,
         cargo_price_discount: basketRecord.cargo_price_discount,
         shipping_address: JSON.parse(selectedShippingAddress),
         billing_address: JSON.parse(data),
      };
      updateBasket(newBasketPost);
   };
   return (
      <>
         <div className="w-full  px-4 pb-10 grid grid-cols-12 gap-x-5">
            <Button
               className="float-left col-span-12 font-semibold text-sm w-full py-7 text-center h-full mb-5 "
               onClick={() => {
                  setFields(
                     Object.entries(address[0] ? address[0] : {}).map(([name]) => ({
                        name,
                        value: null,
                     }))
                  );
                  setNewAddress({ ...newAddress, open: !newAddress.open });
               }}
            >
          New Address
            </Button>

            <div className="col-span-12 float-left mt-10 -mb-16 z-10  text-right">
               <Checkbox
                  className=" w-auto float-right "
                  onChange={(vall: CheckboxChangeEvent) => {
                     setBillingAdressSame(!billingAdressSame);
                     if (vall.target.checked) {
                        if (selectedShippingAddress) {
                           onChanheBillingAddress(selectedShippingAddress);
                           setSelectedBillingAddress(selectedShippingAddress);
                        }
                     }
                  }}
                  checked={billingAdressSame}
               >
            Billing address is same
               </Checkbox>
            </div>
            <div
               className={
                  billingAdressSame ? "col-span-12" : "col-span-12 sm:col-span-6"
               }
            >
               <div className="text-lg  font-semibold w-full sm:mt-10 mt-16">
            Shipping Address
               </div>

               <div className="w-full ">
                  {address &&
              address.map((x, i) => (
                 <AddressSelect
                    key={i}
                    Data={x}
                    setNewAddress={setNewAddress}
                    setFields={setFields}
                    newAddress={newAddress}
                    selectedShippingAddress={selectedShippingAddress}
                    onChanheShppingAddress={onChanheShppingAddress}
                 />
              ))}
               </div>
            </div>
            <div
               className={billingAdressSame ? "hidden" : "col-span-12 sm:col-span-6"}
            >
               <div className="text-lg font-semibold w-full   sm:mt-10 mt-16">
            Billing Address{" "}
               </div>
               <div className="w-full">
                  {address &&
              address.map((x, i) => (
                 <AddressSelect
                    key={i}
                    Data={x}
                    setNewAddress={setNewAddress}
                    setFields={setFields}
                    newAddress={newAddress}
                    selectedBillingAddress={selectedBillingAddress}
                    onChanheBillingAddress={onChanheBillingAddress}
                 />
              ))}
               </div>
            </div>

            <Drawer
               title="Address"
               placement="left"
               onClose={() => {
                  setNewAddress({ ...newAddress, open: !newAddress.open });
               }}
               visible={newAddress.open}
            >
               <Form
                  form={form}
                  onFinishFailed={onFinishFailedAddress}
                  onFinish={onSubmitAddress}
                  fields={fields}
                  scrollToFirstError
               >
                  <Form.Item
                     className="float-left  w-full mx-0 px-0"
                     name="name"
                     fieldKey="name"
                     rules={[{ required: true, message: "Missing Area" }]}
                  >
                     <Input
                        placeholder={intl.messages["app.pages.customers.addressName"]}
                        autoComplete="chrome-off"
                     />
                  </Form.Item>

                  <Form.Item
                     name="type"
                     className="float-left w-full mx-0 px-0"
                     fieldKey="type"
                  >
                     <Select
                        defaultValue={true}
                        options={[
                           { label: "Billing Address", value: true },
                           { label: "Shipping Address", value: false },
                        ]}
                        placeholder="Select Address Type"
                     />
                  </Form.Item>

                  <Form.Item
                     name="country_id"
                     className="float-left w-full mx-0 px-0"
                     fieldKey="country_id"
                  >
                     <Select
                        showSearch
                        options={countryOption}
                        placeholder="Search to Country"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                           (typeof option === "object" &&
                           option &&
                           "label" in option &&
                           typeof (option as { label?: unknown }).label === "string"
                              ? (option as { label: string }).label
                              : ""
                           ).toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(selected: string) => {
                           if (selected == "Turkey") {
                              getCity();
                           } else {
                              const citydata = country.filter((x) => x.name === selected);
                              const dataManipulate: OptionItem[] = [];

                              for (const i in citydata[0].states) {
                                 dataManipulate.push({
                                    label: citydata[0].states[i].name,
                                    value: citydata[0].states[i].name,
                                 });
                              }

                              setCityOption(dataManipulate);
                           }
                           setSelectedO({ ...selectedO, selectedCountry: selected });
                        }}
                     />
                  </Form.Item>

                  <Form.Item
                     className="float-left w-full  mx-0 px-0"
                     name="city_id"
                     fieldKey="city_id"
                     rules={[{ required: true, message: "Missing Area" }]}
                  >
                     <Select
                        showSearch
                        options={cityOption}
                        placeholder={intl.messages["app.pages.customers.addressCity"]}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                           (typeof option === "object" &&
                           option &&
                           "label" in option &&
                           typeof (option as { label?: unknown }).label === "string"
                              ? (option as { label: string }).label
                              : ""
                           ).toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(selected: string) => {
                           if (selectedO.selectedCountry == "Turkey") {
                              const ilce = city.filter((x) => x.Il === selected);
                              const dataManipulate: OptionItem[] = [];
                              for (const i in ilce[0].Ilce) {
                                 dataManipulate.push({
                                    label: ilce[0].Ilce[i].Ilce,
                                    value: ilce[0].Ilce[i].Ilce,
                                 });
                              }
                              setSelectedO({ ...selectedO, selectedCity: selected });
                              setIlceOption({
                                 option: dataManipulate,
                                 data: ilce[0].Ilce,
                              });
                           }
                        }}
                     />
                  </Form.Item>

                  <Form.Item
                     className="float-left w-full  mx-0 px-0"
                     name="town_id"
                     fieldKey="town_id"
                     rules={[{ required: true, message: "Missing Area" }]}
                  >
                     {selectedO.selectedCountry == "Turkey" ? (
                        <Select
                           showSearch
                           options={ilceOption.option}
                           placeholder={intl.messages["app.pages.customers.addressTown"]}
                           optionFilterProp="children"
                           filterOption={(input, option) =>
                              (typeof option === "object" &&
                              option &&
                              "label" in option &&
                              typeof (option as { label?: unknown }).label === "string"
                                 ? (option as { label: string }).label
                                 : ""
                              ).toLowerCase().indexOf(input.toLowerCase()) >= 0
                           }
                           onChange={(selected: string) => {
                              const data = ilceOption.data.filter(
                                 (x) => x.Ilce === selected
                              );
                              const dataManipulate: OptionItem[] = [];
                              for (const i in data[0].Semt) {
                                 dataManipulate.push({
                                    label: data[0].Semt[i].Semt,
                                    value: data[0].Semt[i].Semt,
                                 });
                              }
                              setSelectedO({ ...selectedO, selectedIlce: selected });
                              setSemtOption({
                                 option: dataManipulate,
                                 data: data[0].Semt,
                              });
                           }}
                        />
                     ) : (
                        <Input
                           placeholder={intl.messages["app.pages.customers.addressTown"]}
                           autoComplete="none"
                        />
                     )}
                  </Form.Item>

                  <Form.Item
                     className="float-left w-full  mx-0 px-0"
                     name="district_id"
                     fieldKey="district_id"
                     rules={[{ required: true, message: "Missing Area" }]}
                  >
                     {selectedO.selectedCountry == "Turkey" ? (
                        <Select
                           showSearch
                           options={semtOption.option}
                           placeholder={
                              intl.messages["app.pages.customers.addressDistrict"]
                           }
                           optionFilterProp="children"
                           filterOption={(input, option) =>
                              (typeof option === "object" &&
                              option &&
                              "label" in option &&
                              typeof (option as { label?: unknown }).label === "string"
                                 ? (option as { label: string }).label
                                 : ""
                              ).toLowerCase().indexOf(input.toLowerCase()) >= 0
                           }
                           onChange={(selected: string) => {
                              const data = semtOption.data.filter(
                                 (x) => x.Semt === selected
                              );
                              const dataManipulate: OptionItem[] = [];
                              for (const i in data[0].Mahalle) {
                                 dataManipulate.push({
                                    label: data[0].Mahalle[i].Mahalle,
                                    value: data[0].Mahalle[i].Mahalle,
                                 });
                              }
                              setSelectedO({ ...selectedO, selectedSemt: selected });
                              setMahalleOption({
                                 option: dataManipulate,
                                 data: data[0].Mahalle,
                              });
                           }}
                        />
                     ) : (
                        <Input
                           placeholder={
                              intl.messages["app.pages.customers.addressDistrict"]
                           }
                           autoComplete="none"
                        />
                     )}
                  </Form.Item>

                  <Form.Item
                     name="village_id"
                     className="float-left w-full mx-0 px-0"
                     fieldKey="village_id"
                     rules={[{ required: true, message: "Missing Area" }]}
                  >
                     {selectedO.selectedCountry == "Turkey" ? (
                        <Select
                           showSearch
                           options={mahalleOption.option}
                           placeholder={
                              intl.messages["app.pages.customers.addressNeighbour"]
                           }
                           optionFilterProp="children"
                           filterOption={(input, option) =>
                              (typeof option === "object" &&
                              option &&
                              "label" in option &&
                              typeof (option as { label?: unknown }).label === "string"
                                 ? (option as { label: string }).label
                                 : ""
                              ).toLowerCase().indexOf(input.toLowerCase()) >= 0
                           }
                           onChange={(selected: string) => {
                              setSelectedO({ ...selectedO, selectedMahalle: selected });
                           }}
                        />
                     ) : (
                        <Input
                           placeholder={
                              intl.messages["app.pages.customers.addressNeighbour"]
                           }
                        />
                     )}
                  </Form.Item>
                  <Form.Item
                     className="float-left w-full  mx-0 px-0"
                     name="address"
                     fieldKey="address"
                     rules={[{ required: true, message: "Missing Area" }]}
                  >
                     <Input.TextArea
                        rows={3}
                        placeholder={intl.messages["app.pages.customers.addressFull"]}
                     />
                  </Form.Item>
                  <Button htmlType="submit" className="w-full p-3 h-auto">
              Save
                  </Button>
               </Form>
            </Drawer>
         </div>
      </>
   );
};

export default Default;
