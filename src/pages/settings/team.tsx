import React, { useEffect, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { ArrowDown2 } from "iconsax-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Table from "./table/team";
import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { currentUserVar } from "../../apollo/cache/auth";

const GET_ALL_ADMINS = gql`
  query GetAllAdmins(
    $pagination: Pagination!
    $filter: AdminsFilter
    $search: SearchOperator
    $populate: [String]
  ) {
    getAllAdmins(
      pagination: $pagination
      filter: $filter
      search: $search
      populate: $populate
    ) {
      rows {
        _id
        role {
          name
          code
          description
        }
        email
        profilePicture
        fullName
      }
      count
    }
  }
`;
const ADD_ADMIN = gql`
  mutation AddTeamMembers($input: [AddTeamMembers]!) {
    addTeamMembers(input: $input)
  }
`;

const TeamsPage = () => {
  const [numberOfInputs, setNumberOfInputs] = useState(1);
  const currentUser = useReactiveVar(currentUserVar);
  const [addMembers, { loading }] = useMutation(ADD_ADMIN);

  interface admins {
    email: string;
    role: string;
  }

  interface FormValues {
    admins: admins[];
  }

  const formik = useFormik({
    initialValues: {
      admins: [{ email: "", role: "Member" }],
    },
    validationSchema: Yup.object({
      admins: Yup.array().of(
        Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
          role: Yup.string().required("Role is required"),
        })
      ),
    }),
    onSubmit: async (values: FormValues) => {
      await addMembers({
        variables: {
          input: values.admins,
        },
      }).then(({ data }) => {
        if (data.resetAdminPassword) {
          toast(
            JSON.stringify({
              type: "success",
              title: "Members invited successfully",
            })
          );
          formik.resetForm();
          refetch();
        } else {
          toast(
            JSON.stringify({
              type: "error",
              title: "Members invite failed",
            })
          );
        }
      });
    },
  });

  const {
    data,
    loading: usersLoading,
    refetch,
  } = useQuery(GET_ALL_ADMINS, {
    variables: {
      pagination: {
        skip: 0,
        limit: 10,
      },
      filter: {
        busCompany: {
          eq: currentUser.busCompany._id,
        },
      },
      search: {
        fields: ["email", "fullName"],
        options: ["i"],
        query: "",
      },
      populate: ["role", "busCompany"],
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <React.Fragment>
      <div className="">
        <div className="border-b lg:mx-28 border-gray-200 pb-5 mb-5  mt-8">
          <h1 className="font-manrope text-2xl text-dark font-semibold">
            Team management
          </h1>
          <p className="text-gray-400 text-sm ">
            Manage your team members and their account permissions here.
          </p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="flex  gap-x-36 items-start border-b lg:mx-28 border-gray-200 pb-5 mb-5 "
        >
          <div className="w-[20%] ">
            <h4 className="font-manrope text-base text-dark">
              Invite team members
            </h4>
            <p className="text-sm text-gray-400">
              Get your team members on board by inviting them.
            </p>
          </div>
          <div className="flex-1 flex flex-col gap-5">
            {Array.from({ length: numberOfInputs }).map((_, index) => (
              <div className="flex gap-x-4 items-center" key={index}>
                <div
                  className="flex justify-between items-center  bg-white px-4 border w-full
                  border-gray-300 rounded-lg shadow-sm"
                >
                  <div className="flex items-center h-full w-full  gap-x-4">
                    <MdOutlineMailOutline className="text-gray-300" />
                    <input
                      type="email"
                      {...formik.getFieldProps(`admins[${index}].email`)}
                      placeholder="you@example.com"
                      className="py-2 text-sm text-dark w-full pl-4 focus:outline-none focus:border-none bg-transparent"
                    />
                  </div>
                </div>
                {/* {formik.touched.admins[index].email && formik.errors.admins[index] && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.admins[index]?.email}
                  </div>
                )} */}
                <label htmlFor="role" className="">
                  <div className="mt-1 rounded-none shadow-sm w-32  relative  flex flex-row items-center">
                    <div className="absolute right-0 pr-4">
                      <ArrowDown2 size={16} color="#6B7280" />
                    </div>
                    <select
                      id="role"
                      {...formik.getFieldProps(`admins[${index}].role`)}
                      className="rounded-md border py-2 before:mr-3 select flex px-4 text-gray-500 font-light border-gray-300 appearance-none w-full  sm:text-sm sm:leading-5"
                    >
                      <option value={"Member"}>Member</option>
                      <option value={"Admin"}>Admin</option>
                    </select>
                  </div>
                  {/* {formik.touched.admins && formik.errors.admins && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.admins[index]?.role}
                    </div>
                  )} */}
                </label>
              </div>
            ))}

            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  setNumberOfInputs(numberOfInputs + 1);
                  formik.setValues({
                    ...formik.values,
                    admins: [...formik.values.admins, { email: "", role: "" }],
                  });
                }}
                type="button"
                className="font-medium text-sm text-gray-500"
              >
                <span className="text-base ">+</span> Add another
              </button>
              <button
                type="submit"
                className=" px-3 py-2 flex items-center rounded-lg 
                     gap-x-2 font-normal text-sm bg-primary text-white shadow-sm"
              >
                <MdOutlineMailOutline className="text-white" />{" "}
                {loading ? "Sending..." : "Send invite"}
              </button>
            </div>
          </div>
        </form>

        <div className="flex  gap-x-36 items-start border-b lg:mx-28 border-gray-200 pb-5 mb-5 ">
          <div className="w-[20%] ">
            <h4 className="font-manrope text-base text-dark">Team members</h4>
            <p className="text-sm text-gray-400">
              Manage your existing team and chage roles/permissions.
            </p>
          </div>
          <div className="flex-1 ">
            <Table members={data?.getAllAdmins?.rows} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TeamsPage;
