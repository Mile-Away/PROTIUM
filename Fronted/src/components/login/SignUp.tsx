import { Button } from '@/components/login/Button';
import { useAuthServiceContext } from '@/context/AuthContext';
import { useFormik } from 'formik';
import { Input } from './Input';
import { useState } from 'react';

type SignUpProps = {
  Email: string;
};

const SignUp = ({ Email }: SignUpProps) => {
  const [disableSign, setDisableSign] = useState(false);
  const { login, register } = useAuthServiceContext();
  const formik = useFormik({
    initialValues: {
      email: Email,
      username: '',
      password: '',
      captcha: '',
    },
    validate: (values) => {
      const errors: Partial<typeof values> = {};
      if (!values.username) {
        errors.username = 'Required';
      } else if (values.username.length < 3) {
        errors.username = 'Must be at least 3 characters';
      } else if (
        // 不允许包含特殊字符
        values.username.match(/[^a-zA-Z0-9_]/)
      ) {
        errors.username = 'Must be alphanumeric and underscore only';
      } else if (
        // 最大长度 20
        values.username.length > 20
      ) {
        errors.username = 'Must be less than 20 characters';
      }
      if (!values.password) {
        errors.password = 'Required';
      } else if (values.password.length < 8) {
        errors.password = 'Must be at least 8 characters';
      } else if (
        // 最大长度 50
        values.password.length > 50
      ) {
        errors.password = 'Must be less than 50 characters';
      }

      if (!values.captcha) {
        errors.captcha = 'Required';
      } else if (values.captcha.length < 6) {
        errors.captcha = 'Must be at least 6 characters';
      }
      return errors;
    },
    onSubmit: async (values) => {
      const { email, username, password, captcha } = values;
      const captcha_id = localStorage.getItem('captcha_id');
      if (!captcha_id) {
        formik.setErrors({ captcha: 'Please get the captcha again!' });
      }

      const res = await register(email.toLowerCase(), username, password, captcha, Number(captcha_id || 0));
      setDisableSign(true);

      if (res.status === 201) {
        localStorage.removeItem('captcha_id');
        const res = await login(email, password);

      } else if (res.response?.status === 409) {
        // 当出现这个错误时，在 message 中显示错误信息
        formik.setErrors({ username: 'Username already exists' });
        setDisableSign(false)
      } else if (res.response?.status === 400) {
        formik.setErrors({ captcha: 'Invalid Captcha' });
        setDisableSign(false)
      } else {
        alert(res.response?.data?.error || 'Unknown Error');
        setDisableSign(false)
      }
    },
  });
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="relative isolate flex flex-col items-center pr-1"
    >
      <div className="relative flex w-full flex-col duration-500 animate-in slide-in-from-top-6">
        <Input
          required
          type="text"
          name="username"
          id="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={!!formik.touched.username && !!formik.errors.username}
          message={formik.errors.username}
          placeholder="Create Username"
        />

        <Input
          required
          type="password"
          name="password"
          id="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          placeholder="Create Password"
          error={!!formik.touched.password && !!formik.errors.password}
          message={formik.errors.password}
        />

        <Input
          required
          type="text"
          name="captcha"
          id="captcha"
          value={formik.values.captcha}
          onChange={formik.handleChange}
          placeholder="Enter Captcha from Email"
          error={!!formik.touched.captcha && !!formik.errors.captcha}
          message={formik.errors.captcha}
        >
          <Button type="submit" arrow disabled={disableSign}>
            Sign Up
          </Button>
        </Input>
      </div>
    </form>
  );
};

export default SignUp;
