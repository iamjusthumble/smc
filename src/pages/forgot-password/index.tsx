import React, { useEffect, useRef, useState } from "react";
import _, { last } from "lodash";
import {
  Link,
  useLocation,
  useMatches,
  useNavigate,
  useSearch,
} from "react-location";
import { GoArrowLeft } from "react-icons/go";
import Button from "../../components/buttons";
import { useLocalStorage } from "react-use";
import keyIcon from "../../assets/images/key-icon.png";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import emailIcon from "../../assets/images/email.png";
import successIcon from "../../assets/images/success.png";

import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { LocationGenerics } from "../../router/location";
import { useFormik } from "formik";
import * as Yup from "yup";
import { currentUserVar, setAuth, setMe } from "../../apollo/cache/auth";
import { message } from "antd";

export const SEND_RESET_CODE = gql`
  mutation FindUserByEmail($input: findUserByEmailInput!) {
    findUserByEmail(input: $input) {
      user {
        _id
        email
      }
      status
    }
  }
`;

export const VERIFY_RESET_CODE = gql`
  mutation VerifyCode($input: verifyCodeInput!) {
    verifyCode(input: $input) {
      status
      token
    }
  }
`;
export const RESET_PASSWORD = gql`
  mutation ResetPasswordAfterVerification($input: resetPasswordInput!) {
    resetPasswordAfterVerification(input: $input) {
      status
      message
    }
  }
`;

function ForgotPassword() {
  let currentOTPIndex = 0;
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
  const currentUser = useReactiveVar(currentUserVar);
  const inputRef = useRef<HTMLInputElement>(null);
  const search = useSearch<LocationGenerics>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotStore, setForgotStore] = useLocalStorage<{
    email?: string;
    tab: string;
    token?: string;
  }>("forgot-store", { email: "", tab: "send-code", token: "" });
  const [sendResetCode, { loading: loadingSend }] =
    useMutation(SEND_RESET_CODE);
  const [verifyResetCode, { loading: loadingVerify }] =
    useMutation(VERIFY_RESET_CODE);
  const [resetPassword, { loading: loadingReset }] =
    useMutation(RESET_PASSWORD);
  const sendCodeForm = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email address is required"),
    }),
    onSubmit: async (values: any) => {
      await sendResetCode({
        variables: {
          input: {
            email: values.email,
            typeOfUser: "Admin",
          },
        },
      })
        .then(({ data }) => {
          if (data.findUserByEmail.status === "success") {
            setForgotStore({
              tab: "verify-code",
              email: data.findUserByEmail.user.email,
            });
            setMe(data.findUserByEmail.user);
          }
        })
        .catch((err) => {
          message.error(err?.message ?? "Something went wrong");
        });
    },
  });

  const verifyCodeForm = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .min(4, "Code should be 6 digits")
        .required("Enter reset code"),
    }),
    onSubmit: async (values) => {
      await verifyResetCode({
        variables: {
          input: {
            code: values.code,
            id: currentUser._id,
            typeOfUser: "Admin",
          },
        },
      })
        .then(({ data }) => {
          if (data.verifyCode?.status === "success") {
            const { token } = data.verifyCode;
            console.log(token, "token");

            setForgotStore({
              tab: "reset-password",
              token: token,
            });
          }
        })
        .catch((err) => {
          message.error(err?.message ?? "Something went wrong");
        });
    },
  });
  const resetPasswordForm = useFormik({
    initialValues: {
      password: "",
      rPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be more than 8 characters")
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])/,
          "Must Contain at least One Lowercase Character"
        )
        .matches(
          /^(?=.*[A-Z])/,
          "Must Contain at least One Uppercase Character"
        )
        .matches(/^(?=.*[0-9])/, "Must Contain at least One Number")
        .matches(
          /^(?=.*[!@#$%^&*\\|/{}()<>:;[\]_\\-\\=?])/,
          "Must Contain at least One special case Character"
        ),
      rPassword: Yup.string()
        .oneOf([Yup.ref("password"), undefined], "Passwords do not match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      await resetPassword({
        variables: {
          input: {
            password: values.password,
            confirmedPassword: values.rPassword,
            typeOfUser: "Admin",
          },
        },
        context: {
          headers: {
            authorization: forgotStore?.token,
          },
        },
      })
        .then(({ data }) => {
          if (data?.resetPasswordAfterVerification?.status === "success") {
            message.success("Password reset successfully");
            setForgotStore({ tab: "send-code", email: "" });
            navigate({
              to: search?.redirect ?? "/signin",
            });
          }
        })
        .catch((err) => {
          message.error(err?.message ?? "Something went wrong");
        });
    },
  });

  useEffect(() => {
    setForgotStore({ tab: "send-code", email: "" });
  }, []);

  const handleOnKeyDown = (
    { key }: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    currentOTPIndex = index;
    if (key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
  };

  const handleOnChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = target;
    const newOTP: string[] = [...otp];
    newOTP[currentOTPIndex] = value.substring(value.length - 1);

    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else setActiveOTPIndex(currentOTPIndex + 1);
    setOtp(newOTP);
    verifyCodeForm.setFieldValue("code", newOTP.join(""));
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col  px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {forgotStore?.tab === "send-code" ? (
            <img className="mx-auto h-10 w-auto" src={keyIcon} alt="key icon" />
          ) : forgotStore?.tab === "reset-complete" ? (
            <img
              className="mx-auto h-10 w-auto"
              src={successIcon}
              alt="success icon"
            />
          ) : (
            <img
              src={emailIcon}
              alt="email icon"
              className="mx-auto h-10 w-auto"
              width={"56px"}
              height={"56px"}
              aria-hidden="true"
            />
          )}

          <h2 className="mt-10 text-center text-2xl font-medium font-merriweather leading-9 tracking-tight text-gray-900">
            {forgotStore?.tab === "send-code" ? (
              <span>Forgot Password?</span>
            ) : forgotStore?.tab === "reset-complete" ? (
              <span>Password reset</span>
            ) : forgotStore?.tab === "reset-password" ? (
              <span>Check your email</span>
            ) : null}
          </h2>
          <p className="text-center font-manrope">
            {forgotStore?.tab === "send-code" ? (
              <span> No worries, we’ll send you reset instructions.</span>
            ) : forgotStore?.tab === "reset-complete" ? (
              <span>
                Your password has been successfully reset. Click below to log in
                effortlessly.
              </span>
            ) : forgotStore?.tab === "reset-password" ? (
              <span>
                Your new password must be different to previously used
                passwords.
              </span>
            ) : forgotStore?.tab === "verify-code" ? (
              <span>
                We’ve sent a verification link to{" "}
                {forgotStore?.email || "your email"}
              </span>
            ) : null}
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {forgotStore?.tab === "send-code" && (
            <form onSubmit={sendCodeForm.handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    {...sendCodeForm.getFieldProps("email")}
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 pl-2 font-manrope text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <Button
                  loading={loadingSend}
                  label="Reset Password"
                  className="w-full font-manrope mt-3 rounded-md bg-primary  py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
              </div>
            </form>
          )}
          {forgotStore?.tab === "verify-code" && (
            <form onSubmit={verifyCodeForm.handleSubmit} className="mt-8">
              <div className="flex justify-center items-center space-x-2 mb-6">
                {otp.map((_, index) => {
                  return (
                    <React.Fragment key={index}>
                      <input
                        ref={index === activeOTPIndex ? inputRef : null}
                        type="number"
                        className="w-[63.2px] h-[63.8px] xl:w-20 xl:h-20 border-2 rounded bg-transparent outline-none
                   text-center font-manrope font-[400] text-[37.92px] xl:text-5xl leading-[47.4px] xl:leading-[60px] tracking-[-2%] spin-button-none border-primary
                    focus:border-primary focus:text-primary text-primary shadow-sm transition"
                        onChange={handleOnChange}
                        onKeyDown={(e) => handleOnKeyDown(e, index)}
                        value={otp[index]}
                      />
                    </React.Fragment>
                  );
                })}
              </div>

              <div>
                <Button
                  loading={loadingVerify}
                  label="Verify"
                  className="w-full font-manrope mt-3 rounded-md bg-primary  py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
              </div>
              <p className="text-center font-manrope font-[400] text-sm leading-5 text-grey-600 mt-6">
                Didn’t receive the email?{" "}
                <Link to="#" className="text-primary">
                  Click to resend
                </Link>
              </p>
            </form>
          )}
          {forgotStore?.tab === "reset-password" && (
            <form
              onSubmit={resetPasswordForm.handleSubmit}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2 flex relative items-center">
                  <input
                    placeholder="password"
                    {...resetPasswordForm.getFieldProps("password")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-4 rounded-md border-0 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />

                  <div className="flex absolute right-0 pr-4">
                    {showPassword ? (
                      <FaRegEyeSlash
                        className="cursor-pointer text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <FaRegEye
                        className="cursor-pointer text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                  </div>
                </div>
                {resetPasswordForm.touched.password &&
                  resetPasswordForm.errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {resetPasswordForm.errors.password}
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
                <div className="mt-2 flex relative items-center">
                  <input
                    placeholder="confirm password"
                    {...resetPasswordForm.getFieldProps("rPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-4 rounded-md border-0 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />

                  <div className="flex absolute right-0 pr-4">
                    {showConfirmPassword ? (
                      <FaRegEyeSlash
                        className="cursor-pointer text-gray-500"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      />
                    ) : (
                      <FaRegEye
                        className="cursor-pointer text-gray-500"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      />
                    )}
                  </div>
                </div>
                {resetPasswordForm.touched.rPassword &&
                  resetPasswordForm.errors.rPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {resetPasswordForm.errors.rPassword}
                    </p>
                  )}
              </div>

              <div>
                <Button
                  loading={loadingReset}
                  label="Reset Password"
                  className="w-full font-manrope mt-3 rounded-md bg-primary  py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                />
              </div>
            </form>
          )}
          {forgotStore?.tab === "reset-complete" && (
            <div>
              <Button
                loading={false}
                label="Contine"
                className="w-full font-manrope mt-3 rounded-md bg-primary  py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
            </div>
          )}
          <Link to={"/signin"}>
            <div className="flex mt-10 items-center gap-x-1 justify-center">
              <GoArrowLeft />
              <p className=" text-center text-sm text-gray-500">
                Back to Log in
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
