import React, { useEffect } from 'react';

import { webSocket } from '../../webSocket';

import { createTheme } from "@mui/material/styles";

const theme = createTheme(); // Créez un thème Material-UI

const Chatbox: React.FC = () => {
    return (
        <div className='chat'>
        </div>
    );
};

export default Chatbox;
