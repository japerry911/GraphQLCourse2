import React, { useState, useEffect, Fragment, useContext } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { PROFILE } from "../../graphql/queries";
import { USER_UPDATE } from "../../graphql/mutations";
import omitDeep from "omit-deep";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import UserProfile from "../../components/forms/UserProfile";
import FileUpload from "../../components/forms/FileUpload";

const Profile = () => {
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    images: [],
    about: "",
  });
  const [loading, setLoading] = useState(false);

  const { state } = useContext(AuthContext);

  const { data } = useQuery(PROFILE);

  useEffect(() => {
    if (data) {
      setValues({
        username: data.profile.username,
        name: data.profile.name,
        email: data.profile.email,
        images: omitDeep(data.profile.images, ["__typename"]),
        about: data.profile.about,
      });
    }
  }, [data]);

  const [userUpdate] = useMutation(USER_UPDATE, {
    update: ({ data }) => {
      console.log("USER UPDATE MUTATION IN PROFILE", data);
      toast.success("Profile updated.");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);
    userUpdate({ variables: { input: values } });
    setLoading(false);
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-12 p-3">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Profile</h4>
          )}
        </div>
        <FileUpload
          setValues={setValues}
          setLoading={setLoading}
          values={values}
          loading={loading}
        />
      </div>
      <UserProfile
        values={values}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Profile;
