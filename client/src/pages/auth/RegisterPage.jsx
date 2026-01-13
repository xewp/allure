import React from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage = () => {
  // Custom styling for register page - centered branding
  const registerLeftStyle = {
    justifyContent: "justify-center",
    paddingX: "pl-8 md:pl-16",
    marginLeft: "",
    headingSize: "text-5xl md:text-6xl",
    subheadingSize: "text-lg md:text-xl",
  };

  return (
    <AuthLayout title="Register" leftSectionStyle={registerLeftStyle}>
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
