import React, { useEffect } from "react";
import profile from "../../assets/images/male.jpeg";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LuUploadCloud } from "react-icons/lu";
import { useMutation as useMutationTanStack } from "@tanstack/react-query";
import { UPLOAD_FILE } from "../../services/axios/assets/mutations";
import toast from "react-hot-toast";
import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { currentUserVar, setMe } from "../../apollo/cache/auth";
import Avatar from "../../components/core/avatar";

const UPDATE_PROFILE = gql`
  mutation UpdateAdmin($input: AdminUpdateInput) {
    updateAdmin(input: $input) {
      _id
    }
  }
`;

const ME = gql`
  query MeAdmin {
    meAdmin {
      _id
      fullName
      email
      altEmail
      phone
      profilePicture
      bio
      jobTitle
      createdAt
      updatedAt
      busCompany {
        name
        email
        _id
        logo
        mobileNumber
        status
      }
      role {
        _id
        name
        permissions
        description
        createdAt
        updatedAt
      }
    }
  }
`;

const Details = () => {
  const [fieldsDisabled, setFieldsDisabled] = React.useState(true);
  const [fileLoading, setFileLoading] = React.useState(false);
  const currentUser = useReactiveVar(currentUserVar);
  const { data: me, loading: loadingMe } = useQuery(ME);
  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE);

  useEffect(() => {
    if (me?.meAdmin) {
      setMe(me.meAdmin);
    }
  }, [me]);

  interface FormValues {
    fullName: string;
    email: string;
    phone: string;
    companyName: string;
    bio: string;
    profilePicture: string;
    jobTitle: string;
    alternativeEmail: string;
  }

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      bio: "",
      profilePicture: "",
      jobTitle: "",
      alternativeEmail: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("FullName is required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      phone: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Phone number is required"),
      bio: Yup.string().max(50, "Must be 50 characters or less"),
      jobTitle: Yup.string().max(20, "Must be 20 characters or less"),
      alternativeEmail: Yup.string().email("Invalid email address"),
    }),
    onSubmit: async (values: FormValues) => {
      updateProfile({
        variables: {
          input: {
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
            bio: values.bio,
            jobTitle: values.jobTitle,
            altEmail: values.alternativeEmail,
            profilePicture: values.profilePicture,
          },
        },
      })
        .then(({ data }) => {
          if (data?.updateAdmin?._id) {
            toast(
              JSON.stringify({
                type: "success",
                title: "Profile Updated Successfully",
              })
            );
            setFieldsDisabled(true);
          }
        })
        .catch((e) => {
          toast(
            JSON.stringify({
              type: "failed",
              title: e?.message,
            })
          );
        });
    },
  });

  const { values, setFieldValue } = formik;

  useEffect(() => {
    formik.setFieldValue("fullName", currentUser?.fullName);
    formik.setFieldValue("email", currentUser?.email);
    formik.setFieldValue("phone", currentUser?.phone);
    formik.setFieldValue("companyName", currentUser?.busCompany.name);
    formik.setFieldValue("bio", currentUser?.bio);
    formik.setFieldValue("jobTitle", currentUser?.jobTitle);
    formik.setFieldValue("alternativeEmail", currentUser?.altEmail);
  }, [setFieldsDisabled, currentUser]);

  const { mutate: uploadFile } = useMutationTanStack({
    mutationKey: ["uploadFile"],
    mutationFn: UPLOAD_FILE,
  });

  const handleUpload = (file: any) => {
    setFileLoading(true);
    const data = new FormData();
    data.append("profilePicture", file);
    uploadFile(data, {
      onSuccess: (data) => {
        setFieldValue("profilePicture", data.data.profilePicture[0].url);
        setFileLoading(false);
      },
      onError: (error) => {
        setFileLoading(false);
      },
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      handleUpload(selectedFile);
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit} className="">
        <div className="px-56 mt-8">
          <div className="font-manrope flex justify-between items-center">
            <div className="flex gap-x-5 items-center">
              <div className="relative">
                <Avatar
                  src={currentUser?.profilePicture}
                  disabled={true}
                  size="xl"
                  alt={
                    [
                      currentUser?.fullName.split(" ")[0].split("")[0] || "",
                      currentUser?.fullName.split(" ")[1].split("")[0] || "",
                    ]
                      .join(" ")
                      .trim() || "N A"
                  }
                />
                <VscVerifiedFilled className="absolute bottom-1 right-1 bg-white text-primary w-6 h-6 rounded-full " />
              </div>

              <div className="">
                <h4 className="text-lg text-dark font-medium">Profile</h4>
                <p className="text-xs text-darktxt">
                  {" "}
                  Update your photo and personal details
                </p>
              </div>
            </div>

            {fieldsDisabled ? (
              <button
                className="text-white px-4 py-1 text-center border border-primary bg-primary rounded-lg"
                onClick={() => setFieldsDisabled(false)}
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-x-4 items-center">
                <button
                  className="text-lightgray px-4 py-1 text-center border border-lightgray bg-white rounded-lg"
                  onClick={() => setFieldsDisabled(true)}
                >
                  Cancel
                </button>
                <button
                  className="text-white px-4 py-1 text-center border border-primary bg-primary rounded-lg"
                  type="submit"
                >
                  {loading ? "Loading..." : "Save"}
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Settings forms */}
        <div className="px-56">
          <dl className="mt-6 space-y-6 divide-y  divide-gray-200 text-sm leading-6">
            <div className="pt-6 sm:flex gap-x-10 items-center">
              <dt className="font-medium font-manrope text-gray-500 sm:w-64 sm:flex-none sm:pr-6">
                Full Name
              </dt>
              <div className="mt-2 w-full">
                <input
                  type="text"
                  autoComplete="email"
                  disabled={fieldsDisabled}
                  {...formik.getFieldProps("fullName")}
                  style={{ backgroundColor: "#fff" }}
                  className="rounded-md border w-4/6 border-gray-300 bg-white/5 py-1.5 pl-3"
                />
                {formik.touched.fullName && formik.errors.fullName ? (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.fullName}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="pt-6 sm:flex gap-x-10 items-center">
              <dt className="font-medium font-manrope text-gray-500 sm:w-64 sm:flex-none sm:pr-6">
                Email
              </dt>
              <div className="mt-2 w-full">
                <input
                  type="email"
                  autoComplete="email"
                  disabled={fieldsDisabled}
                  {...formik.getFieldProps("email")}
                  style={{ backgroundColor: "#fff" }}
                  className="rounded-md border w-4/6 border-gray-300 bg-white/5 py-1.5 pl-3"
                />
                {formik.touched.fullName && formik.errors.fullName ? (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="pt-6 sm:flex gap-x-10 items-center">
              <dt className="font-medium font-manrope text-gray-500 sm:w-64 sm:flex-none sm:pr-6">
                Phone Number
              </dt>
              <div className="mt-2 w-full">
                <input
                  type="text"
                  autoComplete="email"
                  disabled={fieldsDisabled}
                  {...formik.getFieldProps("phone")}
                  style={{ backgroundColor: "#fff" }}
                  className="rounded-md border w-4/6 border-gray-300 bg-white/5 py-1.5 pl-3"
                />
                {formik.touched.fullName && formik.errors.fullName ? (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.phone}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="pt-6 sm:flex gap-x-10 items-center">
              <dt className="font-medium font-manrope text-gray-500 sm:w-64 sm:flex-none sm:pr-6">
                Company Name
              </dt>
              <div className="mt-2 w-full">
                <input
                  {...formik.getFieldProps("companyName")}
                  disabled={true}
                  style={{ backgroundColor: "#fff" }}
                  className="rounded-md border w-4/6 border-gray-300 bg-white/5 py-1.5 pl-3"
                />
                {formik.touched.companyName && formik.errors.companyName ? (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.companyName}
                  </div>
                ) : null}
              </div>
            </div>
            {fieldsDisabled ? (
              <>
                <div className="pt-6 sm:flex gap-x-10 items-center">
                  <div>
                    <dt className="font-medium font-manrope text-gray-500 sm:w-64 sm:flex-none sm:pr-6">
                      Your Photo
                    </dt>
                    <dd className="text-gray-500 font-manrope">
                      This will be displayed on your profile
                    </dd>
                  </div>
                  <dd className="mt-1 flex justify-between w-[48%]">
                    <Avatar
                      src={currentUser?.profilePicture}
                      disabled={true}
                      size="sm"
                      alt={
                        [
                          currentUser?.fullName.split(" ")[0].split("")[0] ||
                            "",
                          currentUser?.fullName.split(" ")[1].split("")[0] ||
                            "",
                        ]
                          .join(" ")
                          .trim() || "N A"
                      }
                    />

                    <div className="flex gap-x-1 ">
                      <button className="text-lightgray px-4 py-1 text-center ">
                        Delete
                      </button>
                      <button
                        onClick={() => setFieldsDisabled(false)}
                        className="px-4 py-1 text-center  text-primary "
                      >
                        Update
                      </button>
                    </div>
                  </dd>
                </div>
              </>
            ) : (
              <>
                <div className="pt-6 sm:flex gap-x-10 items-center">
                  <div>
                    <dt className="font-medium font-manrope text-gray-500 sm:w-64 sm:flex-none sm:pr-6">
                      Your Photo
                    </dt>
                    <dd className="text-gray-500 font-manrope">
                      This will be displayed on your profile
                    </dd>
                  </div>
                  <div className="flex flex-1 flex-col items-start gap-y-4 ">
                    <div className="md:flex w-3/4  items-center gap-4 mt-1">
                      <Avatar
                        src={currentUser?.profilePicture}
                        disabled={true}
                        size="sm"
                        alt={
                          [
                            currentUser?.fullName.split(" ")[0].split("")[0] ||
                              "",
                            currentUser?.fullName.split(" ")[1].split("")[0] ||
                              "",
                          ]
                            .join(" ")
                            .trim() || "N A"
                        }
                      />

                      <label
                        htmlFor="file"
                        className="flex bg-white w-[73%] py-5 flex-col justify-center items-center border border-grey-400 rounded-xl"
                      >
                        <div className="flex items-center gap-2 cursor-pointer">
                          <span className="w-[40px] h-[40px] bg-grey-50 ">
                            <div className="text-center bg-grey-100 w-5 h-5 rounded-full">
                              <LuUploadCloud
                                className="text-grey-600 "
                                size={27}
                              />
                            </div>
                          </span>
                          <input
                            type="file"
                            name="file"
                            id="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </div>

                        <div className="font-sans text-center">
                          <p className="text-sm text-grey-600  font-[400] leading-5 text-center">
                            <span className="text-primary">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-grey-600 font-[400] leading-[18px] text-center">
                            SVG, PNG or JPG (max. 800x400px)
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="pt-6 sm:flex gap-x-10 items-center">
              <div>
                <dt className="font-medium font-manrope text-gray-500 sm:w-64 sm:flex-none sm:pr-6">
                  Your bio
                </dt>
                <dd className="text-gray-500 font-manrope">
                  Write a short introduction
                </dd>
              </div>
              <div className="mt-2 w-full h-full">
                <textarea
                  {...formik.getFieldProps("bio")}
                  disabled={fieldsDisabled}
                  placeholder="Add a short bio..."
                  style={{ backgroundColor: "#fff" }}
                  className="rounded-md border font-manrope w-4/6 h-36 border-gray-300 bg-white/5 py-1.5 pl-3"
                />
                {formik.touched.bio && formik.errors.bio ? (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.bio}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="pt-6 sm:flex gap-x-10 items-center">
              <dt className="font-medium font-manrope text-gray-500 sm:w-64 sm:flex-none sm:pr-6">
                Job title
              </dt>
              <div className="mt-2 w-full">
                <input
                  {...formik.getFieldProps("jobTitle")}
                  style={{ backgroundColor: "#fff" }}
                  disabled={fieldsDisabled}
                  className="rounded-md border w-4/6 border-gray-300 bg-white/5 py-1.5 pl-3"
                />

                <div className="flex items-center gap-x-2 mt-2">
                  <input type="checkbox" className="" />
                  <span className="text-gray-500 font-manrope ">
                    Show my job title on my profile
                  </span>
                </div>
                {formik.touched.jobTitle && formik.errors.jobTitle ? (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.jobTitle}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="pt-6 flex items-center">
              <div className="w-[43%]">
                <dt className="font-medium font-manrope text-gray-500 sm:w-64 sm:flex-none sm:pr-6">
                  Alternative contact email
                </dt>
                <dd className="text-gray-500  font-manrope">
                  Enter an alternative email if you’d like to be contacted via a
                  different email.
                </dd>
              </div>
              <div className="mt-2 w-full h-full">
                <input
                  {...formik.getFieldProps("alternativeEmail")}
                  type="email"
                  disabled={fieldsDisabled}
                  autoComplete="email"
                  style={{ backgroundColor: "#fff" }}
                  className="rounded-md border w-4/6 border-gray-300 bg-white/5 py-1.5 pl-3"
                />
                {formik.touched.alternativeEmail &&
                formik.errors.alternativeEmail ? (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.alternativeEmail}
                  </div>
                ) : null}
              </div>
            </div>
          </dl>
        </div>
      </form>
    </React.Fragment>
  );
};

export default Details;
