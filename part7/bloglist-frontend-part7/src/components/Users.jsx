import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Users = () => {

  const users = useSelector((state) => state.users);

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
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
