import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import func from "@app/util/helpers/func";
import filterRouteLinkGenerate from "@app/app/components/FilterProducts/filterRouterLink";
import { filterProducts_r } from "@app/redux/actions";
import type { AppDispatch, RootState } from "@app/redux/store";

const Page = () => {

   const { categories } = useSelector((state: RootState) => state.categories);
   const { filterProducts } = useSelector(
      ({ filterProducts }: RootState) => filterProducts
   );

   type CategoryNode = DataNode & {
      _id: string;
      title: string;
      children?: CategoryNode[];
   };

   const [state, setState] = useState<{
      categories: CategoryNode[];
      allData: CategoryNode[];
   }>({
      categories: [],
      allData: [],
   });

   const dispatch = useDispatch<AppDispatch>();

   const getcategories = () => {
      const dataManipulate = func.getCategoriesTreeOptions(categories, true) as
         | CategoryNode[]
         | undefined;
      const normalized = dataManipulate || [];
      setState({ ...state, categories: normalized, allData: normalized });
   };

   useEffect(() => {
      getcategories();
   }, []);

   const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
      const filterData = func.search_array_object_tree(
         e.target.value,
         state.allData
      );
      setState({
         ...state,
         categories: (filterData as CategoryNode[]) || [],
      });
   };

   const onChange = (selectedKeys: React.Key[]) => {
      const checkedValues = selectedKeys.filter(
         (key): key is string => typeof key === "string"
      );
      dispatch(
         filterProducts_r({
            ...filterProducts,
            categories: checkedValues,
            skip: 0,
         })
      );
      filterRouteLinkGenerate({
         ...filterProducts,
         categories: checkedValues,
         skip: 0,
      });
   };

   return (
      <>
         <Input
            placeholder="Categories..."
            onChange={onChangeSearch}
            suffix={<SearchOutlined />}
         />

         <div className="CategoriesFilter rounded-bottom bg-transparent">
            <Tree
               expandedKeys={
                  func.selectCategoriesFilterData(state.allData) || undefined
               }
               multiple
               className="bg-transparent"
               selectedKeys={filterProducts.categories}
               onSelect={onChange}
               treeData={state.categories}
            />
         </div>
      </>
   );
};

export default Page;
