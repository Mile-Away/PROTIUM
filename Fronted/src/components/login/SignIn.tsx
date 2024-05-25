import { Button } from '@/components/login/Button';
import { Success } from '@/components/notification/Success';
import { useAuthServiceContext } from '@/context/AuthContext';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from './Input';
import Loading from './Loading';

type SignInProps = {
  Email: string;
};

const SignIn = ({ Email }: SignInProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [captchaSented, setCaptchaSented] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigat = useRouter();
  const { login, emailEval, resetPassword } = useAuthServiceContext();

  const formik = useFormik({
    initialValues: {
      email: Email,
      password: '',
      captcha: '',
    },
    validate: (values) => {
      const errors: Partial<typeof values> = {};
      if (
        !values.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ) {
        errors.email = 'Invalid Email Address';
      }
      return errors;
    },
    onSubmit: async (values) => {
      if (isForgetPassword) {
        // 忘记密码时的逻辑
        const { email, password, captcha } = values;
        const res = await resetPassword(email, password, captcha);
        if (res.status === 200) {
          alert('Password Reseted');
        } else {
          formik.setErrors({ captcha: res.response?.data?.error });
        }
      } else {
        const { email, password } = values;

        const res = await login(email, password);

        if (res.status === 200) {
          // Refresh the page
          // navigat.refresh();
        } else {
          setIsWrongPassword(true);
          // console.log(isWrongPassword)
        }
      }
    },
  });

  return (
    <>
      {captchaSented && (
        <Success isOpen={captchaSented}>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-50">
              Successfully Sent Email Captcha!
            </p>
            <p className="mt-1 text-sm text-gray-300">
              Please check your email for the verification captcha.
            </p>
          </div>
        </Success>
      )}
      <form
        onSubmit={formik.handleSubmit}
        className="relative isolate flex flex-col items-center pr-1"
      >
        <div className="relative mt-8 flex w-full flex-col">
          <Input
            required
            type="email"
            autoComplete="email"
            name="email"
            id="email"
            placeholder="Email Eddress"
            onChange={formik.handleChange}
            value={formik.values.email}
            error={!!formik.touched.email && !!formik.errors.email}
            message={formik.errors.email}
            disabled={isForgetPassword}
          />
        </div>
        {isForgetPassword ? (
          <>
            <div className="flex w-full justify-start">
              <p className="-m-2 mb-2 ml-[2px] select-none rounded-lg p-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                Resetting your password:
              </p>
            </div>
            <div className="relative flex w-full flex-col duration-500 animate-in slide-in-from-top-3">
              <Input
                required
                type="text"
                name="captcha"
                id="captcha"
                value={formik.values.captcha}
                onChange={formik.handleChange}
                error={!!formik.touched.captcha && !!formik.errors.captcha}
                message={formik.errors.captcha}
                placeholder="Enter Captcha"
              >
                {isLoading ? <Loading /> : <></>}
                {/* <Button type="submit" arrow>
                Get Captcha
              </Button> */}
              </Input>
            </div>
            <div className="relative flex w-full flex-col duration-500 animate-in slide-in-from-top-3">
              <Input
                required
                type="password"
                name="password"
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onFocus={() => setIsWrongPassword(false)}
                placeholder="Enter New Password"
                error={isWrongPassword}
                message={'Invalid Password'}
              >
                <Button type="submit" arrow>
                  Reset Password
                </Button>
              </Input>
            </div>
          </>
        ) : (
          <>
            <div className="relative flex w-full flex-col duration-500 animate-in slide-in-from-top-3">
              <Input
                required
                type="password"
                name="password"
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onFocus={() => setIsWrongPassword(false)}
                placeholder="Enter Password"
                error={isWrongPassword}
                message={'Invalid Password'}
              >
                <Button type="submit" arrow>
                  Sign In
                </Button>
              </Input>
            </div>
            <div className=" flex w-full justify-end duration-500 animate-in slide-in-from-top-3">
              <button
                type="button"
                onClick={async () => {
                  setIsForgetPassword(true); // 这个用来展示忘记密码的输入框
                  setIsLoading(true); // 这个用来展示加载动画

                  try {
                    const res = await emailEval(formik.values.email, 'forget');

                    if (res.status === 201) {
                      setCaptchaSented(true); // 这个用来提示验证码已发送
                      setIsLoading(false);
                      // console.log(res.data)
                    } else {
                      setIsLoading(false);
                      formik.setErrors({
                        email: res.response?.data?.error || 'Unknown Error',
                      });
                    }
                  } catch (error) {
                    console.error(error);
                  }
                }}
                name="forget"
                className="-m-2 rounded-lg p-2 text-xs text-indigo-950 transition-opacity hover:bg-gray-200/50 hover:text-indigo-600  dark:text-indigo-50 dark:hover:bg-gray-50/5 dark:hover:text-indigo-300"
              >
                Forget Password ?
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default SignIn;
