import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
	endpoints: builder => ({
		getRole: builder.query({
			query: ({username = null, roomName = null}) => ({
				url: '/api/chat/role/' + username + '/' + roomName,
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + Cookies.get('accessToken'),
				}			
			}),
		}),
		getBlockedUsers: builder.query({
			query: ({username = null}) => ({
				url: '/api/chat/' + username + '/blocked',
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + Cookies.get('accessToken'),
				}			
			})
		}),
		getRoomsList: builder.query({
			query: () => ({
				url: '/api/chat/rooms/list',
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + Cookies.get('accessToken'),
				}
			})
		}),
		getUsersInRoom: builder.query({
			query: ({roomName = null}) => ({
				url: '/api/chat/' + roomName + '/users',
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + Cookies.get('accessToken'),
				}
			})
		}),
		getUserRoomList: builder.query({
			query: ({username = null}) => ({
				url: '/api/chat/' + username + '/rooms/list',
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + Cookies.get('accessToken'),
				}
			})
		}),
		getUsersList: builder.query({
			query: () => ({
				url: '/api/chat/users/list',
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + Cookies.get('accessToken'),
				}
			})
		}),
		getUserStatusInRoom: builder.query({
			query: ({username = null, roomName = null}) => ({
				url: '/api/chat/' + username + '/' + roomName + '/status',
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + Cookies.get('accessToken'),
				}
			})
		}),
		getInvitedUsersList: builder.query({
			query: ({username = null, roomName = null}) => ({
				url: '/api/chat/' + username + '/' + roomName + '/invited',
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + Cookies.get('accessToken'),
				}
			}),
		}),
		getIsRoomNameTaken: builder.query({
			query: ({roomName = null}) => ({
				url: '/api/chat/' + roomName + '/exist',
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + Cookies.get('accessToken'),
				}
			})
		}),
		uploadAvatar: builder.mutation({
			query: (body: FormData) => ({
				url: '/api/avatar/upload',
				method: 'POST',
				body: body,
				formData: true,
				headers: {
					'Authorization': 'Bearer ' + Cookies.get('accessToken'),
				}
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
} = apiSlice