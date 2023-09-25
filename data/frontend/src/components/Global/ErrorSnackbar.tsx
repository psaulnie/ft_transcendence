import React, {useEffect, useState} from "react";

import {Alert, Button, Snackbar} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";

export default function ErrorSnackbar({error}: { error: any }) {
  const [message, setMessage] = useState("Unknown error");
  const [errorCode, setErrorCode] = useState(0);
  const [open, setOpen] = useState(true);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  function reload() {
    window.location.href = `http://${import.meta.env.VITE_IP}:5000/auth/logout`;
  }

  useEffect(() => {
    if (error && error.status) setErrorCode(error.status);
    if (error && error.data && error.data.message)
      setMessage(error.data.message);
  }, [error]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{vertical: "top", horizontal: "right"}}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity="error"
        sx={{width: "100%"}}
        action={
          <Button onClick={reload} color="inherit" size="small">
            Reload
            <CachedIcon/>
          </Button>
        }
      >
        Error {errorCode === 0 ? message : `${errorCode}: ${message}`}
      </Alert>
    </Snackbar>
  );
}
