import axios from "axios";
import { API_URL, WEBSITE_URL } from "@root/config";
import fs from "fs";
import path from "path";
import type { GetServerSideProps } from "next";

type ProductEntry = {
   seo: string;
};

type TopmenuEntry = {
   seo: string;
   link?: string;
};

const Sitemap = () => {
   return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
   const resDataProducts = await axios.get<ProductEntry[]>(
      `${API_URL}/productspublic/all`
   );
   const resDataTopmenu = await axios.get<TopmenuEntry[]>(
      `${API_URL}/topmenupublic/not`
   );

   const escapeHtml = (text: string) => {
      const map: Record<string, string> = {
         "&": "&amp;",
         "<": "&lt;",
         ">": "&gt;",
         "\"": "&quot;",
         "'": "&#039;",
      };

      return (
         WEBSITE_URL +
      text.replace(/[&<>"']/g, function (m) {
         return map[m];
      })
      );
   };
   const baseUrl = WEBSITE_URL;

   const staticPages = fs
      .readdirSync("pages")
      .filter((staticPage) => {
         return ![
            "_app.tsx",
            "_document.tsx",
            "_error.tsx",
            "homepage.tsx",
            "sitemap.xml.ts",
         ].includes(staticPage);
      })
      .map((staticPagePath) => {
         const parsed = path.parse(staticPagePath);
         const slug = parsed.name === "index" ? "" : parsed.name;
         return `${baseUrl}/${slug}`;
      });

   const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map((url) => {
         return `
            <url>
              <loc>${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>0.5</priority>
            </url>
          `;
      })
      .join("")}

      ${resDataTopmenu.data
      .map((url) => {
         if (!url.link?.includes("http")) {
            return `
                <url>
                  <loc>${url.link !== ""
      ? escapeHtml(url.link || "")
      : WEBSITE_URL + "/content/" + url.seo
}</loc>
                  <lastmod>${new Date().toISOString()}</lastmod>
                  <changefreq>monthly</changefreq>
                  <priority>0.9</priority>
                </url >
              `;
         }
         return "";
      })
      .join("")}

      ${resDataProducts.data
      .map((url) => {
         return `
                <url>
                  <loc>${WEBSITE_URL}/product/${url.seo}</loc>
                  <lastmod>${new Date().toISOString()}</lastmod>
                  <changefreq>monthly</changefreq>
                  <priority>1</priority>
                </url>
              `;
      })
      .join("")}
    </urlset>
  `;

   res.setHeader("Content-Type", "text/xml");
   res.write(sitemap);
   res.end();

   return {
      props: {},
   };
};

export default Sitemap;
