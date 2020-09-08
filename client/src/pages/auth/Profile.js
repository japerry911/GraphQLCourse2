import React, { useState, useEffect, Fragment, useContext } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { PROFILE } from "../../graphql/queries";
import { USER_UPDATE } from "../../graphql/mutations";
import omitDeep from "omit-deep";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

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

  const fileResizeAndUpload = (event) => {
    let fileInput = false;

    if (event.target.files[0]) {
      fileInput = true;
    }

    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          axios
            .post(
              `${process.env.REACT_APP_REST_ENDPOINT}/uploadimages`,
              { image: uri },
              {
                headers: {
                  authtoken: state.user.token,
                },
              }
            )
            .then((response) => {
              setLoading(false);
              setValues({
                ...values,
                images: [...values.images, response.data],
              });
            })
            .catch((error) => {
              setLoading(false);
              console.log(error);
            });
        },
        "base64"
      );
    }
  };

  const handleImageRemove = (id) => {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_REST_ENDPOINT}/removeimage`,
        { public_id: id },
        {
          headers: {
            authtoken: state.user.token,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        const filteredImages = values.images.filter(
          (image) => image.public_id !== id
        );
        setValues({ ...values, images: filteredImages });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);
    userUpdate({ variables: { input: values } });
    setLoading(false);
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
          className="form-control"
          placeholder="Username"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          className="form-control"
          placeholder="Name"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="form-control"
          placeholder="Email"
          disabled
        />
      </div>
      <div className="form-group">
        <label>About</label>
        <input
          type="text"
          name="about"
          value={values.about}
          onChange={handleChange}
          className="form-control"
          placeholder="About"
          disabled={loading}
        />
      </div>
      <button
        className="btn btn-primary"
        type="submit"
        disabled={!values.email || loading}
      >
        Submit
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label className="btn btn-primary">
              Upload Image
              <input
                hidden
                type="file"
                name="image"
                value={values.image}
                onChange={fileResizeAndUpload}
                className="form-control"
                placeholder="Email"
                disabled={loading}
              />
            </label>
          </div>
        </div>
        <div className="col-md-9">
          {values.images.map((image) => (
            <img
              src={image.url}
              key={image.public_id}
              alt={image.public_id}
              style={{ height: "100px" }}
              className="float-right"
              onClick={() => handleImageRemove(image.public_id)}
            />
          ))}
        </div>
      </div>
      {profileUpdateForm()}
    </div>
  );
};

export default Profile;
