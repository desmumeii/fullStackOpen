import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Users = () => {
  const blogs = useSelector((state) => state.blogs);

  const users = Object.values(
    blogs.reduce((acc, blog) => {
      const user = blog.user;
      if (!user) return acc;

      if (!acc[user.id]) {
        acc[user.id] = {
          id: user.id,
          name: user.name,
          blogs: 0,
        };
      }

      acc[user.id].blogs += 1;
      return acc;
    }, {}),
  );

  return (
    <div className="box">
      <h2 className="title is-4">Users</h2>

      <table className="table is-striped is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td>{u.blogs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
