import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import filterRouteLinkGenerate from "@app/features/filter-products/lib/filterRouterLink";
import { filterProducts_r } from "@app/features/filter-products/model/actions";
import type {
   FilterProductsPayload,
   FilterProductsState,
} from "@app/features/filter-products/model/types";

const Page = () => {
   const { filterProducts } = useSelector(
      (state: { filterProducts: FilterProductsState }) => state.filterProducts
   );
   const [state, setState] = useState<FilterProductsPayload>(filterProducts);
   const dispatch = useDispatch();

   useEffect(() => {
      setState(filterProducts);
   }, [filterProducts]);

   const onChange = () => {
      const nextText = state.text.trim();
      dispatch(
         filterProducts_r({ ...filterProducts, text: nextText, skip: 0 })
      );
      filterRouteLinkGenerate({ ...filterProducts, text: nextText, skip: 0 });
   };

   return (
      <>
         <div className="row py-2  mb-4">
            <h6>Search </h6>
            <Form onFinish={onChange}>
               <Input.Group compact>
                  <Input
                     style={{ width: "84%" }}
                     placeholder="Enter text..."
                     min={0}
                     value={state.text}
                     onChange={(e) =>
                        setState({
                           ...state,
                           text: e.target.value,
                        })
                     }
                  />
                  <Button
                     style={{ width: "16%" }}
                     onClick={() => onChange()}
                     type="primary"
                     className="m-0 p-1 bg-brand-color"
                     htmlType="submit"
                  >
                     <SearchOutlined />
                  </Button>
               </Input.Group>
            </Form>
         </div>
      </>
   );
};

export default Page;
