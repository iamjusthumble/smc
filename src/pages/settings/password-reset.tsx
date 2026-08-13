import React, { useState } from "react";
// import Button from "../../components/inputs/";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-location";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { clearAuth, currentUserVar } from "../../apollo/cache/auth";
import Button from "../../components/buttons";

const CHANGE_PASSWORD = gql`
  mutation UpdateAdminPassword(
    $oldPassword: String!
    $password: String!
    $confirmPassword: String!
    $updateAdminPasswordId: ID!
  ) {
    updateAdminPassword(
      oldPassword: $oldPassword
      password: $password
      confirmPassword: $confirmPassword
      id: $updateAdminPasswordId
    )
  }
`;

const PasswordPage = () => {
  const currentUser = useReactiveVar(currentUserVar);
  interface FormValues {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Required"),
      newPassword: Yup.string()
        .min(8, "Must be 8 characters or more")
        .required("Required"),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), undefined], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values: FormValues) => {
      await changePassword({
        variables: {
          updateAdminPasswordId: currentUser._id,
          confirmPassword: values.confirmNewPassword,
          oldPassword: values.oldPassword,
          password: values.newPassword,
        },
      }).then(({ data }) => {
        if (data.updateAdminPassword === true) {
          toast(
            JSON.stringify({
              type: "success",
              title: "Password updated successfully",
            })
          );
          clearAuth();
          formik.resetForm();
          navigate({
            to: "/login",
          });
        } else {
          toast(
            JSON.stringify({
              type: "error",
              title: "Password update failed",
            })
          );
        }
      });
    },
  });

  const navigate = useNavigate();

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD);

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit} className="">
        <div className="w-full mt-8 md:max-w-[35%] mx-auto">
          <div className="border-b border-gray-200 pb-5 mb-5">
            <h2 className="font-[600] text-lg text-dark">Password</h2>
            <p className="text-gray-400 text-xs">
              Please enter your current password to change your password
            </p>
          </div>
          <div className="border-b border-gray-200 pb-5 mb-5">
            <div className="flex flex-col gap-y-4">
              <label
                htmlFor="password"
                className="text-xs font-medium text-gray-500"
              >
                Current password
              </label>
              <input
                type="password"
                {...formik.getFieldProps("oldPassword")}
                className="py-1 px-4 border w-full
                   border-gray-300 rounded-lg text-dark focus:outline-none "
              />
            </div>
            {formik.touched.oldPassword && formik.errors.oldPassword ? (
              <div className="text-red-600 text-xs mt-1">
                {formik.errors.oldPassword}
              </div>
            ) : null}
            <div className="flex flex-col mt-4 mb-4">
              <label
                htmlFor="password"
                className="text-xs font-medium text-gray-500 mb-3"
              >
                New password
              </label>
              <input
                type="password"
                {...formik.getFieldProps("newPassword")}
                className="py-1 px-4 border w-full
                   border-gray-300 rounded-lg text-dark focus:outline-none "
              />
              <p className="text-gray-400 text-xs pt-1">
                Your new password must be more than 8 characters.
              </p>
              {formik.touched.newPassword && formik.errors.newPassword ? (
                <div className="text-red-600 text-xs mt-1">
                  {formik.errors.newPassword}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-y-4">
              <label
                htmlFor="password"
                className="text-xs font-medium text-gray-500"
              >
                Confirm new password
              </label>
              <input
                type="password"
                {...formik.getFieldProps("confirmNewPassword")}
                id="password"
                className="py-1 px-4 border w-full
                   border-gray-300 rounded-lg text-dark focus:outline-none "
              />
            </div>
            {formik.touched.confirmNewPassword &&
            formik.errors.confirmNewPassword ? (
              <div className="text-red-600 text-xs mt-1">
                {formik.errors.confirmNewPassword}
              </div>
            ) : null}
          </div>

          <div className="flex justify-end items-center">
            <div className="flex gap-x-4 items-center">
              <button
                onClick={() => {
                  // clear formik fields
                  formik.resetForm();
                }}
                className="text-lightgray px-4 py-1 text-center border border-lightgray bg-white rounded-lg"
              >
                Cancel
              </button>
              <Button
                loading={loading}
                label="Save"
                className="text-white px-4 py-1 text-center border border-primary  bg-primary rounded-lg"
              />
            </div>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

export default PasswordPage;
