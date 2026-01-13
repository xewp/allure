import React from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  // Custom styling for login page - larger heading on top
  const loginLeftStyle = {
    justifyContent: "justify-start pt-20 md:pt-32",
    paddingX: "px-4 md:px-0",
    marginLeft: "md:-ml-36",
    headingSize: "text-[70px] md:text-[90px]",
    subheadingSize: "text-xl md:text-2xl",
  };

  return (
    <AuthLayout title="Login" leftSectionStyle={loginLeftStyle}>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
