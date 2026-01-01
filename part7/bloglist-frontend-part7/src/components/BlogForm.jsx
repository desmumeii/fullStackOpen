import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
    });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={addBlog} className="box">
      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input
            className="input"
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="Blog title"
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Author</label>
        <div className="control">
          <input
            className="input"
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="Author name"
          />
        </div>
      </div>

      <div className="field">
        <label className="label">URL</label>
        <div className="control">
          <input
            className="input"
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="field">
        <div className="control">
          <button className="button is-primary" type="submit">
            Create
          </button>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
