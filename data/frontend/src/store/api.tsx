import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
	endpoints: builder => ({
		getRole: builder.query({
			query: ({username = null, roomName = null}) => ({
				url: '/api/chat/role',
				method: 'GET',
				params: { username: username, roomName: roomName },
			}),
		}),
		getBlockedUsers: builder.query({
			query: ({username = null}) => ({
				url: '/api/chat/user/blocked',
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
		getUsersInRoom: builder.query({
			query: ({roomName = null}) => ({
				url: '/api/chat/room/users',
				method: 'GET',
				params: { roomName: roomName },

			})
		}),
		getUserRoomList: builder.query({
			query: ({username = null}) => ({
				url: '/api/chat/user/room/list',
				method: 'GET',
				params: { username: username },

			})
		}),
		getUsersList: builder.query({
			query: () => ({
				url: '/api/chat/users/list',
				method: 'GET'
			})
		}),
		getFilteredUserList: builder.query({
			query: ({username = null, roomName = null}) => ({
				url: '/api/chat/users/list/filtered',
				method: 'GET',
				params: { username: username, roomName: roomName },

			})
		}),
		getUserInfoInRoom: builder.query({
			query: ({username = null, roomName = null}) => ({
				url: '/api/chat/user/room/info',
				method: 'GET',
				params: { username: username, roomName: roomName },
			}),
		}),
		getIsRoomNameTaken: builder.query({
			query: ({roomName = null}) => ({
				url: '/api/chat/rooms/exist',
				method: 'GET',
				params: { roomName: roomName },
			})
		}),
		uploadAvatar: builder.mutation({
			query: (body: FormData) => ({
				url: '/api/upload/avatar',
				method: 'POST',
				body: body,
				formData: true
			})
		}),
	})
})

export const {	useGetRoleQuery,
				useGetBlockedUsersQuery,
				useGetRoomsListQuery,
				useGetUserRoomListQuery,
				useGetIsRoomNameTakenQuery,
				useGetUsersListQuery,
				useGetFilteredUserListQuery,
				useGetUsersInRoomQuery,
				useGetUserInfoInRoomQuery,
				useUploadAvatarMutation,
} = apiSlice