import { useState, useEffect } from "react";
import Link from "next/link";

import { Select, Table, Tooltip, Radio } from "antd";
import { useIntl } from "react-intl";
import axios from "axios";
import { API_URL } from "@root/config";
import moment from "moment";
import Price from "@app/app/components/Price";
import type { ColumnsType } from "antd/es/table";
import type { RadioChangeEvent } from "antd/es/radio";

const Defaut = () => {
   const intl = useIntl();
   type OrderProduct = {
      seo: string;
      title: string;
      qty: number;
      price: number;
      selectedVariants?: Record<string, string | number>;
   };

   type OrderRecord = {
      _id: string;
      ordernumber: string;
      total_price: number | string;
      cargo_price: number;
      createdAt: string;
      receiver_name: string;
      receiver_email: string;
      receiver_phone: string;
      shipping_address: string;
      billing_address: string;
      products: OrderProduct[];
   };

   type OrderStatus = {
      _id: string;
      title: string;
   };

   const [data, setData] = useState<OrderRecord[]>([]);
   const [orderStatus, setOrderStatus] = useState<OrderStatus[]>([]);

   const columns: ColumnsType<OrderRecord> = [
      {
         title: intl.messages["app.pages.orders.orderNumber"],
         dataIndex: "ordernumber",
         key: "ordernumber",
         className: "hidden sm:table-cell ",
      },
      {
         title: intl.messages["app.pages.orders.totalPrice"],
         dataIndex: "total_price",
         key: "total_price",
         render: (_text, record) => {
            const total =
               Number(record.total_price) + Number(record.cargo_price);
            return total.toLocaleString();
         },
      },
      {
         title: intl.messages["app.pages.common.date"],
         dataIndex: "createdAt",
         key: "createdAt",
         render: (text: string) => (
            <Tooltip placement="top" title={moment(text).fromNow()}>
               {moment(text).format("h:mm - DD/MM/YY")}
            </Tooltip>
         ),
      },
   ];

   const getDataFc = () => {
      axios
         .get(API_URL + "/orders")
         .then((res) => {
            if (res.data.length > 0) {
               const data = res.data as OrderRecord[];
               setData(data);
            }
         })
         .catch((err) => console.log(err));
   };

   const getDataStatusFc = (target = "All") => {
      if (target == "All") {
         return getDataFc();
      }
      axios
         .get(API_URL + "/orders/status/" + target)
         .then((res) => {
            setData(res.data as OrderRecord[]);
         })
         .catch((err) => console.log(err));
   };

   const getOrderStatus = () => {
      axios
         .get(API_URL + "/orderstatus")
         .then((res) => {
            if (res.data.length > 0) {
               const data = res.data as OrderStatus[];
               setOrderStatus(data);
            }
         })
         .catch((err) => console.log(err));
   };

   useEffect(() => {
      getOrderStatus();
      getDataFc();
   }, []);

   const getVariant = (data?: Record<string, string | number>) => {
      const variants: JSX.Element[] = [];

      if (!data) {
         return <> </>;
      }

      for (const [property, value] of Object.entries(data)) {
         variants.push(
            <div className="text-xs " key={property}>
               {property}: {value}
            </div>
         );
      }
      return variants.length > 0 ? <> {variants}</> : <> </>;
   };

   return (
      <>
         <Select
            defaultValue="All"
            className="w-full float-right sm:hidden block"
            onChange={(val: string) => {
               getDataStatusFc(val);
            }}
         >
            <Select.Option value="All">
               {intl.messages["app.pages.orders.all"]}
            </Select.Option>
            {orderStatus.map((item) => (
               <Select.Option ghost key={item._id} value={item._id}>
                  {item.title}
               </Select.Option>
            ))}
         </Select>

         <Radio.Group
            defaultValue="All"
            className="float-right mx-auto invisible sm:visible"
            buttonStyle="solid"
            onChange={(val: RadioChangeEvent) => {
               getDataStatusFc(String(val.target.value));
            }}
         >
            <Radio.Button value="All">
               {intl.messages["app.pages.orders.all"]}
            </Radio.Button>
            {orderStatus.map((item) => (
               <Radio.Button key={item._id} value={item._id}>
                  {item.title}
               </Radio.Button>
            ))}
         </Radio.Group>
         <Table
            columns={columns}
            pagination={{ position: ["bottomRight"] }}
            dataSource={[...data]}
            rowKey="_id"
            expandable={{
               expandedRowRender: (record) => (
                  <div className="m-0 w-full ">
                     <div className="text-xl col-span-12   font-semibold text-center mb-10">
                Order Number:{record.ordernumber}{" "}
                     </div>
                     <div className="grid grid-cols-12 ">
                        <div className="col-span-12 sm:col-span-6">
                           <div className="font-bold">Receiver</div>
                           <div>{record.receiver_name}</div>
                           <div>{record.receiver_email}</div>
                           <div>{record.receiver_phone}</div>
                        </div>
                        <div className=" col-span-12 sm:col-span-4">
                           <div className="font-bold mt-5">Shipping Address</div>
                           <div>{record.shipping_address}</div>
                        </div>
                        <div className="col-span-12 sm:col-span-4">
                           <div className="font-bold mt-5">Billing Address</div>
                           <div>{record.billing_address}</div>
                        </div>
                     </div>

                     <div className="text-xl col-span-12 mt-24   font-semibold text-center mb-10">
                Products
                     </div>

                     <table className="w-full bg-black-100  bg-gray-100 !text-center py-5  !rounded-xl ">
                        <tr className="font-semibold">
                           <td className=" border-b pb-5">Title</td>
                           <td className="  border-b pb-5 hidden sm:block">Variant</td>
                           <td className="  border-b pb-5">Qty</td>
                           <td className="  border-b pb-5">Price</td>
                        </tr>
                        {record.products.map((x) => (
                           <tr
                              key={x.seo}
                              className="h-20 !border-b !border-black hover:bg-gray-50 "
                           >
                              <td className="border-b font-semibold">
                                 <Link href={"/" + x.seo}>{x.title}</Link>
                                 <span className="block sm:hidden mt-3">
                                    {getVariant(x.selectedVariants)}
                                 </span>
                              </td>
                              <td className="border-b hidden sm:block">
                                 {getVariant(x.selectedVariants)}
                              </td>
                              <td className="border-b">{x.qty}</td>
                              <td className="border-b">
                                 <Price data={x.price * x.qty} />
                              </td>
                           </tr>
                        ))}
                        <tr>
                           <td className="hidden sm:block"> </td>
                           <td className="hidden sm:block"> </td>
                           <td className="font-semibold">
                              <br />
                    Cargo Price:
                              <br />
                    Total Price:
                           </td>
                           <td className="font-bold">
                              <br />
                              <Price data={record.cargo_price} />
                              <br />
                              <Price
                                 data={
                                    Number(record.total_price) + Number(record.cargo_price)
                                 }
                              />
                           </td>
                        </tr>
                     </table>
                  </div>
               ),
               rowExpandable: () => true,
            }}
         />
      </>
   );
};

export default Defaut;
