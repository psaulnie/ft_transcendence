import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
	endpoints: builder => ({
		getRole: builder.query({
			query: ({username = null, roomName = null}) => ({
				url: '/api/chat/role/' + username + '/' + roomName,
				method: 'GET',
				// params: { username: username, roomName: roomName },
			}),
		}),
		getBlockedUsers: builder.query({
			query: ({username = null}) => ({
				url: '/api/chat/' + username + '/blocked',
				method: 'GET',
				// params: { username: username },
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
				url: '/api/chat/' + roomName + '/users',
				method: 'GET',
				// params: { roomName: roomName },

			})
		}),
		getUserRoomList: builder.query({
			query: ({username = null}) => ({
				url: '/api/chat/' + username + '/rooms/list',
				method: 'GET',
				// params: { username: username },

			})
		}),
		getUsersList: builder.query({
			query: () => ({
				url: '/api/chat/users/list',
				method: 'GET'
			})
		}),
		getUserStatusInRoom: builder.query({
			query: ({username = null, roomName = null}) => ({
				url: '/api/chat/' + username + '/' + roomName + '/status',
				method: 'GET',
				// params: { username: username, roomName: roomName },

			})
		}),
		getInvitedUsersList: builder.query({
			query: ({username = null, roomName = null}) => ({
				url: '/api/chat/' + username + '/' + roomName + '/invited',
				method: 'GET',
				// params: { username: username, roomName: roomName },
			}),
		}),
		getIsRoomNameTaken: builder.query({
			query: ({roomName = null}) => ({
				url: '/api/chat/' + roomName + '/exist',
				method: 'GET',
				// params: { roomName: roomName },
			})
		}),
		uploadAvatar: builder.mutation({
			query: (body: FormData) => ({
				url: '/api/avatar/upload',
				method: 'POST',
				body: body,
				formData: true
			})
		}),
		isAuthentified: builder.mutation({
			query: (body: string) => ({
				url: '/api/avatar/upload',
				method: 'POST',
				body: body
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
				useGetUserStatusInRoomQuery,
				useGetUsersInRoomQuery,
				useGetInvitedUsersListQuery,
				useUploadAvatarMutation,
				useLazyGetIsRoomNameTakenQuery,
				useLazyGetUsersInRoomQuery,
				useIsAuthentifiedMutation
} = apiSlice