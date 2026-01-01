import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import { showNotification } from "./reducers/notificationReducer";
import Togglable from "./components/Togglable";
import LoginForm from "./components/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import Notification from "./components/Notification";
import {
  addingBlog,
  initializeBlogs,
  likingBlog,
  removingBlog,
  commentingBlog,
} from "./reducers/blogReducer";
import { loginUser, logoutUser, setUser } from "./reducers/loginReducer";
import { initializeUsers } from "./reducers/userReducer";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Users from "./components/Users";
import { Blogs, BlogView } from "./components/Blogs";
import User from "./components/User";
import "bulma/css/bulma.min.css";

const App = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [comment, setComment] = useState("");
  const user = useSelector((state) => state.login);
  const blogs = useSelector((state) => state.blogs);
  const users = useSelector((state) => state.users);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
      dispatch(initializeBlogs());
      dispatch(initializeUsers());
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    dispatch(logoutUser());
    blogService.setToken(null);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const credentials = { username, password };
      await dispatch(loginUser(credentials)); // loginUser will handle localStorage & Redux
      const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
      const loggedUser = JSON.parse(loggedUserJSON);

      blogService.setToken(loggedUser.token);
      dispatch(initializeBlogs());

      setUsername("");
      setPassword("");
    } catch (error) {
      dispatch(showNotification("wrong username or password", "error", 5));
    }
  };

  const addBlog = async (blogObject) => {
    dispatch(addingBlog(blogObject));
    dispatch(
      showNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
        "success",
        5,
      ),
    );
  };

  const handleComment = async (id, comment) => {
    if (comment.trim() === "") {
      dispatch(showNotification("comment cannot be empty", "error", 5));
      return;
    }
    dispatch(commentingBlog(id, comment));
    dispatch(showNotification(`you commented on blog`, "success", 5));
    setComment("");
  };
  const handleLike = async (blog) => {
    dispatch(likingBlog(blog));
    dispatch(
      showNotification(
        `you liked ${blog.title} by ${blog.author}`,
        "success",
        5,
      ),
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        dispatch(removingBlog(id));
        dispatch(showNotification("blog deleted successfully", "success", 5));
      } catch {
        dispatch(showNotification("error deleting blog", "error", 5));
      }
    }
  };

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  );

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        {loginForm()}
      </div>
    );
  }

  const padding = {
    padding: 5,
  };

  return (
    <>
      <nav className="navbar is-light" role="navigation">
        <div className="navbar-brand">
          <Link className="navbar-item has-text-weight-bold" to="/">
            BlogApp
          </Link>
        </div>

        <div className="navbar-menu">
          <div className="navbar-start">
            <Link className="navbar-item" to="/">
              Blogs
            </Link>
            <Link className="navbar-item" to="/users">
              Users
            </Link>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <span className="mr-3">{user.name} logged in</span>
              <button className="button is-light" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="section">
        <div className="container">
          <h1 className="title">Blogs</h1>

          <Notification />

          <Routes>
            <Route
              path="/"
              element={
                <Blogs
                  blogs={blogs}
                  user={user}
                  handleLike={handleLike}
                  handleDelete={handleDelete}
                  addBlog={addBlog}
                />
              }
            />
            <Route
              path="/blogs/:id"
              element={
                <BlogView
                  user={user}
                  handleLike={handleLike}
                  handleDelete={handleDelete}
                  comment={comment}
                  setComment={setComment}
                  handleComment={handleComment}
                />
              }
            />
            <Route path="/users" element={<Users users={users} />} />
            <Route path="/users/:id" element={<User users={users} />} />
          </Routes>
        </div>
      </section>
    </>
  );
};

export default App;
