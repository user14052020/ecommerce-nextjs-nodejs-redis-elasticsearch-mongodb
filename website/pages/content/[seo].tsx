import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { API_URL } from "@root/config";
import axios from "axios";
import dynamic from "next/dynamic";
import type { GetServerSideProps, NextPage } from "next";
import type { RootState } from "@app/redux/store";

const Head = dynamic(() => import("@app/app/core/Head"));

type TopmenuItem = {
   _id: string;
   seo: string;
   title: string;
   categories_id?: string;
   description_short?: string;
   [key: string]: unknown;
};

type ContentData = {
   description: string;
   [key: string]: unknown;
};

interface ContentPageProps {
   seo: string;
   resData: ContentData;
}

const Page: NextPage<ContentPageProps> = ({ seo, resData }) => {
   const { topmenu } = useSelector((state: RootState) => state.topmenu);

   const typedTopmenu = topmenu as TopmenuItem[];
   const content =
      typedTopmenu.find((x) => x.seo == seo) || {
         _id: "",
         seo,
         title: "",
         categories_id: "",
         description_short: "",
      };
   const leftMenu = typedTopmenu.filter(
      (x) => x.categories_id == content.categories_id
   );
   const leftMenuTitle = typedTopmenu.find(
      (x) => x._id == content.categories_id
   );

   const [contentDescription, setContentDescription] = useState("<p></p>");

   function createMarkup() {
      return { __html: contentDescription };
   }

   const replaceStyle = (dataHtml: string) => {
      return dataHtml
        .replace(/<p>/g, "<p style='min-height:25px' >")
        .replace(
          /<pre>/g,
          "<pre  style='min-height:30px; background-color:#dbdbdb; padding:15px' >"
        )
        .replace(/<img /g, "<img class='w-full sm:w-auto' ")
        .replace(
          /<div class="media-wrap image-wrap /g,
          '<div class="media-wrap image-wrap  w-full sm:w-auto '
        );
    };

   useEffect(() => {
      setContentDescription(replaceStyle(resData.description));
   }, [resData.description]);

   return (
      <div className="container-custom h-full ">
         <Head
            title={content.title}
            description={content.description_short}
            keywords={content.description_short}
         />
         <div className="grid shadow-lg p-4 grid-cols-12 my-8 sm:gap-9 bg-white">
            <div className=" lg:col-span-3  col-span-12 sm:order-2 order-2 ">
               <div className="text-xl font-semibold col-span-12 text-brand-color  mb-5 mt-5 sm:mt-0  ">
                  {leftMenuTitle && leftMenuTitle.title}
               </div>
               {leftMenu &&
            leftMenu?.map((x) => (
               <Link href={"/content/" + x.seo} key={x._id || x.seo}>
                  <a className="w-full py-3 border-b border-t -mt-0.1 float-left hover:pl-1  transform-all">
                     {x.title}
                  </a>
               </Link>
            ))}
            </div>
            <div className=" lg:col-span-9 sm:order-2 order-1  col-span-12 ">
               <div className="text-2xl font-semibold col-span-12 text-brand-color  mb-5   ">
                  {content && content.title}
               </div>
               <div dangerouslySetInnerHTML={createMarkup()} />
            </div>
         </div>
      </div>
   );
};

export const getServerSideProps: GetServerSideProps<ContentPageProps> = async ({
   query,
}) => {
   const res = await axios.get(`${API_URL}/topmenupublic/${query.seo}`);

   return {
      props: {
         seo: typeof query.seo === "string" ? query.seo : "",
         resData: res.data[0],
      },
   };
};

export default Page;
