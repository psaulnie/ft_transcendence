import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${import.meta.env.VITE_IP}:5000`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getRole: builder.query({
      query: ({ username = null, roomName = null }) => ({
        url: "/api/chat/role/" + username + "/" + roomName,
        method: "GET",
      }),
    }),
    getBlockedUsers: builder.query({
      query: () => ({
        url: "/api/chat/user/blocked",
        method: "GET",
      }),
    }),
    getRoomsList: builder.query({
      query: () => ({
        url: "/api/chat/rooms/list",
        method: "GET",
      }),
    }),
    getUsersInRoom: builder.query({
      query: ({ roomName = null }) => ({
        url: "/api/chat/" + roomName + "/users",
        method: "GET",
      }),
    }),
    getUserRoomList: builder.query({
      query: () => ({
        url: "/api/chat/user/rooms/list",
        method: "GET",
      }),
    }),
    getUsersList: builder.query({
      query: () => ({
        url: "/api/chat/users/list",
        method: "GET",
      }),
    }),
    getUserStatusInRoom: builder.query({
      query: ({ roomName = null }) => ({
        url: "/api/chat/user/" + roomName + "/status",
        method: "GET",
      }),
    }),
    getInvitedUsersList: builder.query({
      query: ({ username = null, roomName = null }) => ({
        url: "/api/chat/" + username + "/" + roomName + "/invited",
        method: "GET",
      }),
    }),
    getIsRoomNameTaken: builder.query({
      query: ({ roomName = null }) => ({
        url: "/api/chat/" + roomName + "/exist",
        method: "GET",
      }),
    }),
    getUserFriendsList: builder.query({
      query: () => ({
        url: "/api/chat/user/friends",
        method: "GET",
      }),
    }),
    getUserProfile: builder.query({
      query: ({ username = null }) => ({
        url: "/api/profile/" + username,
        method: "GET",
      }),
    }),
    getUserAchievements: builder.query({
      query: ({ username = null }) => ({
        url: "/api/profile/" + username + "/achievements",
        method: "GET",
      }),
    }),
    getUserRank: builder.query({
      query: () => ({
        url: "/api/profile/user/rank",
        method: "GET",
      }),
    }),
    getLeaderboard: builder.query({
      query: () => ({
        url: "/api/profile/general/leaderboard",
        method: "GET",
      }),
    }),
    uploadAvatar: builder.mutation({
      query: (body: FormData) => ({
        url: "/api/avatar/upload",
        method: "POST",
        body: body,
        formData: true,
      }),
    }),
    getFriendsList: builder.query({
      query: () => ({
        url: "/friends/list",
        method: "GET",
      }),
    }),
    getIsMuted: builder.query({
      query: ({ username = null, roomName = null }) => ({
        url: "/api/chat/" + roomName + "/" + username + "/muted",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetRoomsListQuery,
  useGetUsersListQuery,
  useGetUserStatusInRoomQuery,
  useGetUsersInRoomQuery,
  useGetInvitedUsersListQuery,
  useLazyGetUserFriendsListQuery,
  useUploadAvatarMutation,
  useLazyGetIsRoomNameTakenQuery,
  useLazyGetUsersInRoomQuery,
  useLazyGetBlockedUsersQuery,
  useLazyGetUserRoomListQuery,
  useGetUserProfileQuery,
  useGetUserAchievementsQuery,
  useGetLeaderboardQuery,
  useGetFriendsListQuery,
  useLazyGetUserRankQuery,
  useLazyGetIsMutedQuery,
} = apiSlice;
