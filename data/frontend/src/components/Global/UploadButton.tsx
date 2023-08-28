import { useState } from "react";

import { useUploadAvatarMutation } from "../../store/api";

import { Button, Grid, Input } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

export default function UploadButton() {
  const user = useSelector((state: any) => state.user);

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);	
  const [uploadAvatar] = useUploadAvatarMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] !== undefined) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
      ];
      if (!allowedTypes.includes(e.target.files[0].type)) {
        alert("Only images are allowed");
        setSelectedFile(undefined);
        setFileUrl("");
      } else if (e.target.files[0].size > 1024 * 1024 * 5) {
        alert("Image is too large");
        setSelectedFile(undefined);
        setFileUrl("");
      } else {
        setSelectedFile(e.target.files[0]);
        setFileUrl(URL.createObjectURL(e.target.files[0]));
      }
    }
  };

  const handleUpload = () => {
    const formData = new FormData();
    if (selectedFile !== undefined) {
      formData.append("username", user.username);
      formData.append("file", selectedFile);
      uploadAvatar(formData);
    }
  };

  const handleRemovePicture = () => {

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    fetch(`http://${process.env.REACT_APP_IP}:5000/api/avatar/remove?username=${user.username}`, {
      credentials: 'include',
      headers: {
        authorization: 'Bearer ' + Cookies.get('accessToken')
      }
    }).catch(() => {
      // TODO : handle fetch error
    });
  };

  return (
    <Grid>
      <Input onChange={handleFileChange} type="file" />
      <Button onClick={handleUpload} variant="contained">
        Upload
        <UploadIcon />
      </Button>
      {fileUrl !== "" ? <img width="15%" src={fileUrl} alt="avatar" /> : null}
      <Button onClick={handleRemovePicture} disabled={isLoading}>Remove</Button>
    </Grid>
  );
}
