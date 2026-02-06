export type SignInFormValues = {
  username: string;
  password: string;
};

export type ForgotPasswordValues = {
  username: string;
};

export type ResetPasswordValues = {
  password: string;
  confirm?: string;
};
