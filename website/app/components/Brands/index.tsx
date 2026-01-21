import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, History } from "swiper";
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import Link from "next/link";
import { IMG_URL } from "@root/config";
import type { RootState } from "@app/redux/store";

SwiperCore.use([Navigation, Pagination, History]);


type BrandItem = {
   _id: string;
   title: string;
   image: string;
};

const Default = () => {
   const { brands } = useSelector((state: RootState) => state.brands);
   const typedBrands = brands as BrandItem[];

   return (
      <div className="container-custom  relative mt-4 h-28">
         <div className="position-absolute container px-xs-0">
            <div className="top-brands-arrow-left">
               <DoubleLeftOutlined />
            </div>
            <div className="top-brands-arrow-right">
               <DoubleRightOutlined />
            </div>


            <Swiper
               slidesPerView={1}
               spaceBetween={10}
               pagination={false}

               navigation={{
                  prevEl: ".top-brands-arrow-left",
                  nextEl: ".top-brands-arrow-right",
               }}
               breakpoints={{
                  340: {
                     slidesPerView: 4,
                  },
                  640: {
                     slidesPerView: 5,
                  },
                  768: {
                     slidesPerView: 7,
                  },
                  1024: {
                     slidesPerView: 8,
                  },
                  1224: {
                     slidesPerView: 10,
                  },
               }}
               className="brands-slider"
            >
               {typedBrands.map((val) => (
                  <SwiperSlide key={val.title}>
                     <div className="item text-center">
                        <Link href={`/search?brands=${val._id}`}>
                           <a>
                              <img
                                 src={`${IMG_URL + val.image}`}
                                 width="70"
                                 height="70"
                                 alt={val.title}
                                 className="mx-auto"
                              />
                              <span className="  w-full float-left"> {val.title}</span>
                           </a>
                        </Link>
                     </div>
                  </SwiperSlide>
               ))}
            </Swiper>
         </div>
      </div>
   );
};

export default Default;
