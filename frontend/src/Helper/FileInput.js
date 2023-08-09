import { useState, useContext } from "react";
import { Grid, Button, TextField, LinearProgress } from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";
import PublishIcon from "@material-ui/icons/Publish";
import axios from "axios";

import { PopupContext } from "../App";

const FileInput = (props) => {
  const setPopup = useContext(PopupContext);

  const { uploadTo, identifier, handleInput } = props;

  const [file, setFile] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleUpload = () => {
    console.log("File -> ", file);
    const data = new FormData();
    data.append("file", file);
    axios
      .post(uploadTo, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total),
            ),
          );
        },
      })
      .then((response) => {
        console.log(response.data);
        handleInput(identifier, response.data.url);
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error in uploading",
        });
      });
  };

  return (
    <Grid container item xs={12} direction="column" className={props.className}>
      <Grid container item xs={12} spacing={0}>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            component="label"
            style={{ width: "100%", height: "100%" }}
          >
            {props.icon}
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(event) => {
                setUploadPercentage(0);
                setFile(event.target.files[0]);
              }}
              name="file"
            />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label={props.label}
            value={file ? file.name || "" : ""}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "100%", height: "100%" }}
            onClick={() => handleUpload()}
            disabled={!file}
          >
            <PublishIcon />
          </Button>
        </Grid>
      </Grid>
      {uploadPercentage !== 0 ? (
        <Grid item xs={12} style={{ marginTop: "10px" }}>
          <LinearProgress variant="determinate" value={uploadPercentage} />
        </Grid>
      ) : null}
    </Grid>
  );
};

export default FileInput;
