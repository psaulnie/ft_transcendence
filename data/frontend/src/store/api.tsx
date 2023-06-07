import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
	endpoints: builder => ({
		getRole: builder.query({
			query: ({username = null, channelName = null}) => ({
				url: '/api/chat/role',
				method: 'GET',
				params: { username: username, roomName: channelName},
			}),
		}),
		getBlockedUsers: builder.query({
			query: ({username = null}) => ({
				url: '/api/chat/blocked',
				method: 'GET',
				params: { username: username },
			})
		}),
		getRoomsList: builder.query({
			query: () => ({
				url: '/api/chat/rooms/list',
				method: 'GET'
			})
		}),
		getIsRoomNameTaken: builder.query({
			query: ({roomName = null}) => ({
				url: '/api/chat/rooms/exist',
				method: 'GET',
				params: { roomName: roomName },
			})
		})
	})
})

export const { useGetRoleQuery, useGetBlockedUsersQuery, useGetRoomsListQuery, useGetIsRoomNameTakenQuery } = apiSlice