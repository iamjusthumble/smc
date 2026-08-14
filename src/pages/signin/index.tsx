import { Link, useNavigate, useSearch } from "react-location";
import { FC, useEffect, useState } from "react";
import { useAuth } from "../../context/auth-context";
import TextInput from "../../components/core/text-input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LocationGenerics } from "../../router/location";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

interface FormValues {
  email: string;
  password: string;
}

// Supabase's raw auth error messages, mapped to something a user can act on.
// Anything not listed here falls back to the raw message.
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Incorrect email or password.",
};

const LoginPage: FC = () => {
  useEffect(() => {
    document.title = "Login | BusBuk";
  }, []);
  const navigate = useNavigate();
  const search = useSearch<LocationGenerics>();
  const { signIn } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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
      setAuthError(null);
      setSubmitting(true);
      try {
        const { error } = await signIn(values.email, values.password);
        if (error) {
          setAuthError(AUTH_ERROR_MESSAGES[error.message] ?? error.message);
          return;
        }
        navigate({ replace: true, to: search?.redirect ?? "/" });
      } finally {
        setSubmitting(false);
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

              {authError && (
                <div className="flex items-start gap-x-2 rounded-md bg-red-50 p-3">
                  <ExclamationCircleIcon
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-red-700">{authError}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Signing in..." : "Sign in"}
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
