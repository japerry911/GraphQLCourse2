import React, { useState, Fragment } from "react";
import firebase, { auth } from "../../firebase";
import { toast } from "react-toastify";
import AuthForm from "../../components/forms/AuthForm";

const PasswordUpdate = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      await auth.currentUser.updatePassword(password);
      setLoading(false);
      setPassword("");
      toast.success("Password successfully updated.");
    } catch (error) {
      setLoading(false);
      setPassword("");
      toast.error(`Error - ${error}`);
    }
  };

  return (
    <div className="container p-5">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <AuthForm
          password={password}
          setPassword={setPassword}
          loading={loading}
          handleSubmit={handleSubmit}
          showPasswordInput
          hideEmailInput
        />
      )}
    </div>
  );
};

export default PasswordUpdate;
