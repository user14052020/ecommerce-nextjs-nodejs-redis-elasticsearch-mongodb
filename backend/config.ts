type MailerAuthConfig = {
  user: string;
  pass: string;
};

type MailerConfig = {
  service: string;
  auth: MailerAuthConfig;
};

export const WEBSITE_URL =
  process.env.WEBSITE_URL || "http://localhost:3000";

export const maillerConfig: MailerConfig = {
  service: process.env.MAIL_SERVICE || "Gmail",
  auth: {
    user: process.env.MAIL_USER || "noreplyexamplemail@gmail.com",
    pass: process.env.MAIL_PASS || "noraplymailpassword",
  },
};
