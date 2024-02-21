import React, { useEffect, useRef, useState } from "react";

import Button from "./Button";

import "./ImageUpload.scss";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [valid, setValid] = useState(false);

  const inputRef = useRef();
  const pickImageHandler = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let isValid = valid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setValid(true);
      isValid = true;
    } else {
      setValid(false);
      isValid = false;
    }
    props.onInput(props.id, pickedFile, isValid);
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview"></img>}
          {!previewUrl && <p>Please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!valid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
