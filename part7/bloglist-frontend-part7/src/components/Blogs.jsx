import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export const Blogs = ({ blogs, addBlog }) => {
  const blogForm = () => (
    <Togglable buttonLabel="create new blog">
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  return (
    <div>
      <h2 className="title is-4">Blogs</h2>
      {blogForm()}

      <table className="table is-fullwidth is-striped is-hoverable">
        <tbody>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <tr key={blog.id}>
                <td>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </td>
                <td className="has-text-right">{blog.likes} likes</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export const BlogView = ({
  user,
  handleLike,
  handleDelete,
  handleComment,
  comment,
  setComment,
}) => {
  const { id } = useParams();

  const blogs = useSelector((state) => state.blogs);
  const blog = blogs.find((b) => b.id.toString() === id);

  if (!blog) return <p>Blog not found</p>;

  return (
    <div className="box">
      <h2 className="title is-4">{blog.title}</h2>
      <h3 className="subtitle is-6">by {blog.author}</h3>

      <div className="mb-3">
        <a
          href={blog.url}
          target="_blank"
          rel="noopener noreferrer"
          className="has-text-link"
        >
          {blog.url}
        </a>
      </div>

      <div className="mb-3">
        <span className="mr-2">{blog.likes} likes</span>
        <button
          className="button is-small is-info"
          onClick={() => handleLike(blog)}
        >
          like
        </button>
      </div>

      <div className="mb-4 has-text-grey">
        added by <strong>{blog.user?.name}</strong>
      </div>

      {user && user.username === blog.user.username && (
        <button
          className="button is-small is-danger mb-4"
          onClick={() => handleDelete(blog.id)}
        >
          delete
        </button>
      )}

      <hr />

      <h3 className="title is-5">Comments</h3>

      <form
        className="field has-addons mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleComment(blog.id, comment);
        }}
      >
        <div className="control is-expanded">
          <input
            className="input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
          />
        </div>
        <div className="control">
          <button className="button is-primary" type="submit">
            add
          </button>
        </div>
      </form>

      {blog.comments?.length === 0 ? (
        <p className="has-text-grey">No comments yet</p>
      ) : (
        <ul>
          {blog.comments.map((c, i) => (
            <li key={i} className="mb-1">
              • {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Blogs;
