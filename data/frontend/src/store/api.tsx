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
	})
  })
})

export const { useGetRoleQuery } = apiSlice