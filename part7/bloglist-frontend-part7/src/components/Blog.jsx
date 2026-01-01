import { useState } from "react";
const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const showDeleteButton = () => {
    if (blog.user && blog.user?.username === user.username) {
      return <button onClick={() => handleDelete(blog.id)}>remove</button>;
    }
    return null;
  };

  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      {visible && (
        <div className="blogDetails">
          {blog.url}
          <br />
          likes {blog.likes}
          <button onClick={() => handleLike(blog)}>like</button>
          <br />
          {blog.user?.name}
          {showDeleteButton() && (
            <>
              <br />
              <button onClick={() => handleDelete(blog.id)}>delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default Blog;
