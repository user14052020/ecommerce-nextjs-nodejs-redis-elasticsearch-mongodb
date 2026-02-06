
const jsonConfig = {

    API_URL: "http://localhost:5001",
    WEBSITE_URL: "http://localhost:3000",
    IMG_URL: "http://localhost:8000",

    maillerConfig: {
        // host: 'smtp.gmail.com',
        // port: 465,
        // secure: true,
        // tls: { rejectUnauthorized: true },
        service: 'Gmail',
        auth: {
            user: 'noreplyexamplemail@gmail.com',
            pass: 'noraplymailpassword'
        }
    },

    languageData: [
        {
            languageId: 'english',
            locale: 'en',
            name: 'English',
            icon: 'us'
        },
        {
            languageId: 'turkish',
            locale: 'tr',
            name: 'Türkçe',
            icon: 'tr'
        },
        {
            languageId: 'russian',
            locale: 'ru',
            name: 'Русский',
            icon: 'ru'
        }
    ],

    defaultLanguage: {
        languageId: 'english',
        locale: 'en',
        name: 'English',
        icon: 'us'
    },

    TOPMENU_SOCIAL_ID: "614b8cc75c153bab76bdf681",
    FOOTER_MENU_ID: "6154a5a279053f941d1b786c",
    HOME_SLIDER_CATEGORY_ID: "61535837020a748d51968ecc",
    HOME_FIRST_BOX_CATEGORY_ID: "61537c2d6464c09286494c63",
    HOME_OFFER_LIST_ID: "6154640f79053f941d1b76c9",
    PAYMENT_STRIPE_METHOD_ID: "6132787ae4c2740b7aff7320"
}

const isServer = typeof window === "undefined";

const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || jsonConfig.API_URL;
const internalApiUrl = process.env.API_URL_INTERNAL || process.env.API_URL || publicApiUrl;
jsonConfig.API_URL = isServer ? internalApiUrl : publicApiUrl;

const publicWebsiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || jsonConfig.WEBSITE_URL;
jsonConfig.WEBSITE_URL = isServer ? (process.env.WEBSITE_URL_INTERNAL || process.env.WEBSITE_URL || publicWebsiteUrl) : publicWebsiteUrl;

const publicImgUrl = process.env.NEXT_PUBLIC_IMG_URL || jsonConfig.IMG_URL;
jsonConfig.IMG_URL = isServer
    ? (process.env.IMG_URL_INTERNAL || process.env.IMG_URL || publicImgUrl)
    : publicImgUrl;
if (process.env.TOPMENU_SOCIAL_ID) {
    jsonConfig.TOPMENU_SOCIAL_ID = process.env.TOPMENU_SOCIAL_ID
}
if (process.env.FOOTER_MENU_ID) {
    jsonConfig.FOOTER_MENU_ID = process.env.FOOTER_MENU_ID
}
if (process.env.HOME_SLIDER_CATEGORY_ID) {
    jsonConfig.HOME_SLIDER_CATEGORY_ID = process.env.HOME_SLIDER_CATEGORY_ID
}
if (process.env.HOME_FIRST_BOX_CATEGORY_ID) {
    jsonConfig.HOME_FIRST_BOX_CATEGORY_ID = process.env.HOME_FIRST_BOX_CATEGORY_ID
}
if (process.env.HOME_OFFER_LIST_ID) {
    jsonConfig.HOME_OFFER_LIST_ID = process.env.HOME_OFFER_LIST_ID
}
if (process.env.PAYMENT_STRIPE_METHOD_ID) {
    jsonConfig.PAYMENT_STRIPE_METHOD_ID = process.env.PAYMENT_STRIPE_METHOD_ID
}

module.exports = jsonConfig
