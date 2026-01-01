import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog,
      );
    },
    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
    likeBlog(state, action) {
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog,
      );
    },
    commentBlog(state, action) {
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog,
      );
    },
  },
});

export const { setBlogs, appendBlog, updateBlog, deleteBlog, commentBlog } =
  blogSlice.actions;
export const initializeBlogs = (blogs) => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const addingBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch(appendBlog(newBlog));
  };
};

export const likingBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    });
    dispatch(updateBlog(updatedBlog));
  };
};

export const removingBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch(deleteBlog(id));
  };
};

export const commentingBlog = (id, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.addComment(id, comment);
    dispatch(commentBlog(updatedBlog));
  };
};
export default blogSlice.reducer;
