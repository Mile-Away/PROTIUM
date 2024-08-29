import { Button } from '@/components/login/Button';
import { Success } from '@/components/notification/Success';
import { useAuthServiceContext } from '@/context/AuthContext';
import useAnonymousPost from '@/hooks/useAnonymousPost';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Input } from './Input';
import Loading from './Loading';
import SignIn from './SignIn';
import SignUp from './SignUp';

interface EmailEval {}

export function SignUpForm() {
  const { isLogged, emailEval } = useAuthServiceContext();
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [loadSubmit, setLoadSubmit] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const { postData, dataBack, error, isLoading } = useAnonymousPost<unknown>(
    '/accounts/check_email_exists/?is_public=true',
  );

  const formik = useFormik({
    initialValues: {
      email: '',
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
      //
      setLoadSubmit(true);
      const { email } = values;

      // 把邮箱小写
      const lowerEmail = email.toLowerCase();

      const response = await postData({ email: lowerEmail }); // 判断邮箱是否已存在

      if (response.status === 200) {
        // 如果邮箱已存在，显示登录界面
        setLoadSubmit(false);
        setShowLogin(true);
        setDisableSubmit(true);
        setShowCaptcha(false);
      } else {
        // 发送验证邮件，传入 register 参数
        const res = await emailEval(email, 'register');
        //
        if (res.status === 201) {
          setLoadSubmit(false);
          setShowCaptcha(true);
          setDisableSubmit(true);
          setSuccessAlert(true);
          setTimeout(() => {
            setSuccessAlert(false);
          }, 10000);
          localStorage.setItem('captcha_id', res.data.id);
          localStorage.setItem('disableSubmit', Date.now().toString());
          localStorage.setItem('email', formik.values.email);
          localStorage.setItem('enableCaptcha', Date.now().toString());

          // 设置 5 分钟后验证码过期
          setTimeout(() => {
            setDisableSubmit(false);
            localStorage.removeItem('disableSubmit');
            localStorage.removeItem('email');
            localStorage.removeItem('enableCaptcha');
          }, 300000);
        }
        // else if (res.response?.status === 422) {
        //   setLoadSubmit(false);
        //   formik.setErrors({ email: res.response?.data?.error });
        // }
        else {
          setLoadSubmit(false);
          formik.setErrors({
            email: res.response?.data?.error || 'Unknown Error',
          });
        }
      }
    },
  });

  // 设置手动刷新后的倒计时
  // useEffect(() => {
  //   // 检查 localStorage 中是否存在禁用状态
  //   const disableStatus = localStorage.getItem('disableSubmit');
  //   const enableCaptcha = localStorage.getItem('enableCaptcha');
  //   const email = localStorage.getItem('email');

  //   if (enableCaptcha) {
  //     setShowCaptcha(true);
  //   }
  //   if (email) {
  //     formik.setFieldValue('email', email);
  //   }
  //   //
  //   if (disableStatus) {
  //     setDisableSubmit(true);
  //     //
  //     const remainingTime = 300000 - (Date.now() - Number(disableStatus));
  //     const remainingTimeInt = Math.ceil(remainingTime / 1000);
  //     //
  //     setCountdown(remainingTimeInt);
  //     setTimeout(() => {
  //       setDisableSubmit(false);
  //       setShowCaptcha(false);
  //       formik.setErrors({ email: '已超时，请重新获取验证码。' });
  //       localStorage.removeItem('disableSubmit');
  //       localStorage.removeItem('email');
  //       localStorage.removeItem('enableCaptcha');
  //     }, remainingTime);
  //   }
  // }, [disableSubmit, countdown]);

  return (
    <>
      {successAlert && (
        <Success isOpen={successAlert}>
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
      {/* {isLogged && <LoggedForm />} */}
      {!isLogged && !showLogin && (
        <form
          onSubmit={formik.handleSubmit}
          className="relative isolate mt-8 flex flex-col items-center pr-1"
        >
          <div className="relative flex w-full flex-col">
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
              // disabled={loadSubmit ? loadSubmit : disableSubmit}
              onFocus={() => {
                setShowCaptcha(false);
                setShowLogin(false);
                setDisableSubmit(false);
                setSuccessAlert(false);
              }}
            >
              {loadSubmit ? (
                <Loading />
              ) : (
                <Button
                  type="submit"
                  arrow
                  disabled={disableSubmit}
                  remain={showCaptcha || showLogin ? countdown : 0}
                  className={''}
                >
                  Get Started
                </Button>
              )}
            </Input>
          </div>
        </form>
      )}

      {!isLogged && showLogin && <SignIn Email={formik.values.email} />}
      {!isLogged && showCaptcha && <SignUp Email={formik.values.email} />}
    </>
  );
}
