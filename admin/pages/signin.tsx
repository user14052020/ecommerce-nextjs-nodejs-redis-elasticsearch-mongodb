import { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Row,
  Col,
  Typography,
  Select,
} from "antd";
import { useIntl } from "react-intl";
import IntlMessages from "@app/util/IntlMessages";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import { switchLanguage, login_r, isAuthenticated_r } from "@app/redux/actions";
import { languageData } from "@root/config";

import AuthService from "@app/util/services/authservice";
import type { AppDispatch, RootState } from "@app/redux/store";
import type { LanguageInfo } from "@app/redux/types";

type SignInFormValues = {
  username: string;
  password: string;
};

const SignInPage = () => {
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.login);

  console.log("isAuthenticated", isAuthenticated);
  const { locale } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    if (isAuthenticated) {
      Router.push("/dashboard");
    }
  }, [isAuthenticated]);

  const onSubmit = (Data: SignInFormValues) => {
    AuthService.login(Data).then((data) => {
      const { isAuthenticated, user } = data;

      if (isAuthenticated) {
        dispatch(login_r(user));
        dispatch(isAuthenticated_r(true));

        Router.push("/dashboard");
        message.success(intl.messages["app.userAuth.Login Successfully."]);
      } else {
        message.error(intl.messages["app.userAuth.You did not login."]);
        Router.replace("/signin");
      }
    });
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col sm={6} offset={3} xs={18} className="my-5">
          <Typography.Title className="text-center mt-5">
            NextLy
          </Typography.Title>
          <div className="text-center fs-10 mb-5">
            Fortune favors the bold.
          </div>
          <Form
            initialValues={{ remember: true }}
            onFinish={onSubmit}
            layout="vertical"
          >
            <Form.Item
              rules={[
                {
                  required: true,
                  message: (
                    <IntlMessages id="app.userAuth.The input is not valid E-mail!" />
                  ),
                },
              ]}
              name="username"
              label={<IntlMessages id="app.userAuth.E-mail" />}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: (
                    <IntlMessages id="app.userAuth.Please input your Password!" />
                  ),
                },
              ]}
              name="password"
              label={<IntlMessages id="app.userAuth.Password" />}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                className="mb-0 w-full"
                size="large"
                htmlType="submit"
              >
                <IntlMessages id="app.userAuth.signIn" />
              </Button>
            </Form.Item>
          </Form>
          <Button
            type="link"
            className="float-left"
            onClick={() => Router.push("/forgotpassword")}
          >
            <IntlMessages id="app.userAuth.Forgot Password" />
          </Button>
          <Select
            showSearch
            className="float-right w-30"
            defaultValue={JSON.stringify(locale)}
            bordered={false}
            filterOption={(input, option) => {
              const label =
                typeof option === "string" ? option : (option?.toString() || "");
              return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
            onChange={(newValue: string) => {
              dispatch(switchLanguage(JSON.parse(newValue) as LanguageInfo));
            }}
          >
            {languageData.map((language) => (
              <Select.Option
                key={JSON.stringify(language)}
                value={JSON.stringify(language)}
              >
                {String(language.name)}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col sm={3} xs={0} />
        <Col sm={12} xs={24}>
          <div className="loginBanner"></div>
        </Col>
      </Row>
    </>
  );
};

export default SignInPage;
