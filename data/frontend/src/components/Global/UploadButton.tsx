import { useState } from "react";

import { useUploadAvatarMutation } from "../../store/api";

import { Button, Grid, Input } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { useSelector } from "react-redux";

export default function UploadButton() {
	const user = useSelector((state: any) => state.user);

	const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
	const [fileUrl, setFileUrl] = useState('');
	const [uploadAvatar] = useUploadAvatarMutation();


	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0] != undefined)
		{
			const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
			setSelectedFile(e.target.files[0]);
			setFileUrl(URL.createObjectURL(e.target.files[0]));
			if (!allowedTypes.includes(e.target.files[0].type))
			{
				alert('Only images are allowed');
				setSelectedFile(undefined);
				setFileUrl('');
			}
		}
	};

	const handleUpload = () => {
		const formData = new FormData();
		if (selectedFile != undefined)
		{
			formData.append('username', user.username);
			formData.append('file', selectedFile);
			uploadAvatar(formData);
		}
	};
	
	return (
		<Grid>
			<Input onChange={handleFileChange} type="file" />
			<Button onClick={handleUpload} variant="contained" >
				Upload
				<UploadIcon />
			</Button>
			{fileUrl != '' ? <img width="15%" src={fileUrl} /> : null}
			
		</Grid>
	);
}