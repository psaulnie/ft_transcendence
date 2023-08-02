import React, { useEffect } from 'react';

import { chatSocket } from '../../chatSocket';

import { useDispatch, useSelector } from 'react-redux';
import { useGetBlockedUsersQuery } from '../../store/api';
import { useGetUserRoomListQuery } from '../../store/api';
import { addBlockedUser } from '../../store/user';

import Room from './Room';
import CreateChannel from './CreateChannel';
import JoinChannel from './JoinChannel';
import JoinDirectMessage from './JoinDirectMessage';
import DirectMessageProvider from './DirectMessageProvider';
import ChatProcess from './ChatProcess';
import Error from '../Global/Error';

import { Skeleton, Box, Grid, Paper } from '@mui/material';

import RoomTabs from './RoomTabs';
import Chat from './Chat';
import { addRoom, setRoomIndex } from '../../store/rooms';

import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme(); // Créez un thème Material-UI

const Chatbox: React.FC = () => {
    return (
        <div className='chat'>
        </div>
    );
};

export default Chatbox;
