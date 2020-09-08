import React, { useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import AuthForm from "../../components/forms/AuthForm";

const PasswordForgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    const config = {
      url: process.env.REACT_APP_PASSWORD_FORGOT_REDIRECT,
      handleCodeInApp: true,
    };

    try {
      await auth.sendPasswordResetEmail(email, config);
      toast.success(
        `Email is sent to ${email}. Click on the link to reset your password.`
      );
      setEmail("");
      setLoading(false);
    } catch (error) {
      toast.error(`Error - ${error}`);
      setLoading(false);
    }
  };

  return (
    <div className="container p-5">
      {loading ? (
        <h4 className="text-danger">Loading</h4>
      ) : (
        <h4>Forgot Password</h4>
      )}
      <AuthForm
        email={email}
        handleSubmit={handleSubmit}
        setEmail={setEmail}
        loading={loading}
      />
    </div>
  );
};

export default PasswordForgot;
