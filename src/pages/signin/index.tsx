// eslint-disable-next-line @typescript-eslint/no-var-requires
import { Link, useNavigate, useSearch } from "react-location";
import { FC, useEffect, useState } from "react";
import { currentPushTokenVar, setAuth } from "../../apollo/cache/auth";
import TextInput from "../../components/core/text-input";
import { useFormik } from "formik";
import { gql, useMutation, useReactiveVar } from "@apollo/client";
import * as Yup from "yup";
import toast from "react-hot-toast";

const LOGIN_USER_MUTATION = gql`
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      user {
        _id
        fullName
        email
        phone
        profilePicture
        role {
          _id
          name
          permissions
          description
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        busCompany {
          logo
          _id
          mobileNumber
          name
        }
      }
      token
    }
  }
`;

interface FormValues {
  email: string;
  password: string;
}

const LoginPage: FC = () => {
  useEffect(() => {
    document.title = "Login | Adjuma";
  }, []);
  const navigate = useNavigate();

  const [login, { loading }] = useMutation(LOGIN_USER_MUTATION);

  const { handleSubmit, ...form } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Invalid email")
        .required("Email is required")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Please enter a valid email address"
        ),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values: FormValues) => {
      const response = await login({
        variables: {
          email: values.email,
          password: values.password,
        },
      });

      if (response.data.loginAdmin?.user) {
        const { user, token } = response.data.loginAdmin;
        toast(
          JSON.stringify({
            type: "success",
            title: "Login Success",
            description: `Logged in as ${user.email}`,
          })
        );
        setAuth({
          user,
          token,
        });
        return navigate({
          replace: true,
          to: "/",
        });
      }
    },
  });

  return (
    <>
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Bus<span className="text-primary">Buk</span>
          </h1>
        </div>

        <div className="mt-10">
          <div>
            <form
              onSubmit={handleSubmit}
              action="#"
              method="POST"
              className="space-y-6"
            >
              <div>
                <div className="mt-2">
                  <TextInput
                    id="email"
                    label="Email address"
                    type="email"
                    placeholder="e.g. user@domain.com"
                    {...form}
                  />
                </div>
              </div>

              <div>
                <div className="mt-2">
                  <TextInput
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="e.g.  **************"
                    {...form}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 font-manrope text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <Link
                    to={"/forgot-password"}
                    className="font-semibold font-manrope text-primary hover:text-primary"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
