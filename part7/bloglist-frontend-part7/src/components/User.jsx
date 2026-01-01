import { useParams } from "react-router-dom";

const User = ({ users }) => {
  const { id } = useParams();
  const user = users.find((u) => u.id === id);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="box">
      <h2 className="title is-4">{user.name}</h2>

      <h3 className="subtitle is-6">Added blogs</h3>

      {user.blogs.length === 0 ? (
        <p className="has-text-grey">No blogs added</p>
      ) : (
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id} className="mb-1">
              • {blog.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default User;
