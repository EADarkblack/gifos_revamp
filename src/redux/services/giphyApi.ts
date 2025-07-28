import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//API
import {
  GIPHY_API,
  GIPHY_API_KEY,
  GIPHY_API_UPLOAD_KEY,
} from "@/utils/constants/api";

export const giphyApi = createApi({
  reducerPath: "giphyApi",
  baseQuery: fetchBaseQuery({ baseUrl: GIPHY_API }),
  endpoints: (builder) => ({
    getTagsBySearch: builder.query({
      query: (searchTerm) =>
        `gifs/search/tags?api_key=${GIPHY_API_KEY}&q=${searchTerm}&limit=5`,
    }),
    getGifBySearch: builder.query({
      query: ({ searchTerm, offset }) =>
        `gifs/search?api_key=${GIPHY_API_KEY}&q=${searchTerm}&limit=16&offset=${offset}`,
      keepUnusedDataFor: 0,
    }),
    getTrendTags: builder.query({
      query: () => `trending/searches?api_key=${GIPHY_API_KEY}`,
      transformResponse: (response) => response.data.slice(0, 5),
    }),
    getTrendGifs: builder.query({
      query: () => `gifs/trending?api_key=${GIPHY_API_KEY}&limit=12`,
    }),
    postGif: builder.mutation({
      query: (formData) => ({
        url: `${GIPHY_API_UPLOAD_KEY}/gifs?api_key=${GIPHY_API_KEY}`,
        method: "POST",
        body: formData,
      }),
    }),
    getGifById: builder.query({
      query: (id) => `gifs/${id}?api_key=${GIPHY_API_KEY}`,
    }),
  }),
});

export const {
  useGetTagsBySearchQuery,
  useGetGifBySearchQuery,
  useGetTrendTagsQuery,
  useGetTrendGifsQuery,
  usePostGifMutation,
  useGetGifByIdQuery,
} = giphyApi;
