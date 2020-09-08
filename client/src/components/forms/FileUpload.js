import React, { useContext, Fragment } from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

const FileUpload = ({ setLoading, setValues, loading, values }) => {
  const { state } = useContext(AuthContext);

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

  return (
    <Fragment>
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
    </Fragment>
  );
};

export default FileUpload;
