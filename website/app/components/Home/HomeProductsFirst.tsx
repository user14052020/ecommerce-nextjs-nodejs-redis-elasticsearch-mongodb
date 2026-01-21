import ProductCard from "@app/app/components/ProductCard";

type ProductItem = {
   _id: string;
   seo: string;
   title: string;
   [key: string]: unknown;
};

type SectionTitle = {
   title?: string;
   description?: string;
};

type HomeProductsFirstProps = {
   state?: ProductItem[];
   title?: SectionTitle;
};

const Default = ({
   state = [],
   title = { title: "", description: "" },
}: HomeProductsFirstProps) => {
   return (
      <div className="bg-gray-50 w-full ">
         <div className=" container-custom py-10 grid grid-cols-12">
            <div className=" col-span-12 text-center mb-5 ">
               <h1>{title.title}</h1>
               <h2 className="text-lg	">{title.description}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5   col-span-12 float-left">
               {state &&
            state.map((data) => (
               <div key={data._id}>
                  <ProductCard
                     data={data}
                     className="rounded-lg m-2 sm:m-3 bg-white  group   overflow-hidden  shadow-sm hover:shadow-xl pb-0 "
                  />
               </div>
            ))}
            </div>
         </div>
      </div>
   );
};

export default Default;
