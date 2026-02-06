import { Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useSelector } from "react-redux";
import type { BasketState } from "@app/entities/basket/model/types";

const BasketLink = () => {
   const { basket } = useSelector((state: { basket: BasketState }) => state.basket);
   const count = basket?.[0]?.products?.length ?? 0;

   return (
      <Link href="/basket">
         <a className="p-2 float-left relative">
            {count > 0 ? (
               <div className=" float-left w-0 h-full pt-0.5 pl-0.5 -mr-0.5">
                  <div className="  rounded-full    absolute w-1 h-1 right-2 -top-1">
                     <Badge size="small" count={count}></Badge>
                  </div>
               </div>
            ) : (
               ""
            )}

            <ShoppingCartOutlined />
            <span className="hidden md:inline "> Basket</span>
         </a>
      </Link>
   );
};

export default BasketLink;
