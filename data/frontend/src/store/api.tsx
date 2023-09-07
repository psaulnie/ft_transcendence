import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${process.env.REACT_APP_IP}:5000`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getRole: builder.query({
      query: ({ username = null, roomName = null }) => ({
        url: "/api/chat/role/" + username + "/" + roomName,
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }),
    }),
    getBlockedUsers: builder.query({
      query: () => ({
        url: "/api/chat/user/blocked",
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }),
    }),
    getRoomsList: builder.query({
      query: () => ({
        url: "/api/chat/rooms/list",
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }),
    }),
    getUsersInRoom: builder.query({
      query: ({ roomName = null }) => ({
        url: "/api/chat/" + roomName + "/users",
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }),
    }),
    getUserRoomList: builder.query({
      query: () => ({
        url: "/api/chat/user/rooms/list",
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }),
    }),
    getUsersList: builder.query({
      query: () => ({
        url: "/api/chat/users/list",
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }),
    }),
    getUserStatusInRoom: builder.query({
      query: ({ roomName = null }) => ({
        url: "/api/chat/user/" + roomName + "/status",
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }),
    }),
    getInvitedUsersList: builder.query({
      query: ({ username = null, roomName = null }) => ({
        url: "/api/chat/" + username + "/" + roomName + "/invited",
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }),
    }),
    getIsRoomNameTaken: builder.query({
      query: ({ roomName = null }) => ({
        url: "/api/chat/" + roomName + "/exist",
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }),
    }),
    getUserFriendsList: builder.query({
      query: () => ({
        url: "/api/chat/user/friends",
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }),
    }),
    getUserProfile: builder.query({
      query: ({ username = null }) => ({
        url: "/api/profile/" + username,
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }),
    }),
    getUserAchievements: builder.query({
      query: ({ username = null }) => ({
        url: "/api/profile/" + username + "/achievements",
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }),
    }),
    getUserRank: builder.query({
      query: () => ({
        url: "/api/profile/user/rank",
        method: "GET",
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }),
    }),
    uploadAvatar: builder.mutation({
      query: (body: FormData) => ({
        url: "/api/avatar/upload",
        method: "POST",
        body: body,
        formData: true,
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      }),
    }),
  }),
});

export const {
  useGetRoleQuery,
  useGetBlockedUsersQuery,
  useGetRoomsListQuery,
  useGetUserRoomListQuery,
  useGetIsRoomNameTakenQuery,
  useGetUsersListQuery,
  useGetUserStatusInRoomQuery,
  useGetUsersInRoomQuery,
  useGetInvitedUsersListQuery,
  useGetUserFriendsListQuery,
  useLazyGetUserFriendsListQuery,
  useUploadAvatarMutation,
  useLazyGetIsRoomNameTakenQuery,
  useLazyGetUsersInRoomQuery,
  useLazyGetBlockedUsersQuery,
  useLazyGetUserRoomListQuery,
  useGetUserProfileQuery,
  useGetUserAchievementsQuery,
  useGetUserRankQuery,
} = apiSlice;
