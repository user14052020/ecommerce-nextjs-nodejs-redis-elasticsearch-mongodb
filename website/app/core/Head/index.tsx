import Head from "next/head";
import { useSelector } from "react-redux";
import { IMG_URL } from "@root/config";
import type { RootState } from "@app/redux/store";

type HeadProps = {
   title?: string;
   description?: string;
   keywords?: string;
   image?: string;
   author?: string;
};

const Default = ({
   title = "",
   description = "",
   keywords = "",
   image = "",
   author = "",
}: HeadProps) => {
   const { settings } = useSelector((state: RootState) => state.settings);

   const getSettingString = (value: unknown) =>
      typeof value === "string" ? value : "";

   if (title == "") {
      title = getSettingString(settings.title);
   }
   if (description == "") {
      description = getSettingString(settings.description);
   }
   if (keywords == "") {
      keywords = getSettingString(settings.keywords);
   }
   if (image == "") {
      image = getSettingString(settings.image);
   }
   if (author == "") {
      author = getSettingString(settings.company);
   }

   return (
      <Head>
         <title> {title}</title>
         <meta name="description" content={description} />
         <meta name="keywords" content={keywords} />
         <meta name="author" content={author} />

         <meta property="og:title" content={title} />
         <meta property="og:description" content={description} />
         <meta property="og:image" content={IMG_URL + image} />
      </Head>
   );
};

export default Default;
