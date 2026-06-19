import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function Dashboard() {
  const [contacts, setContacts] = useState([]);

  const admin = localStorage.getItem("admin");

  useEffect(() => {
    fetch("http://localhost:5000/api/contact")
      .then((res) => res.json())
      .then((data) => setContacts(data))
      .catch((err) => console.log(err));
  }, []);

  if (!admin) {
    return <Navigate to="/login" />;
  }

  const logout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <button onClick={logout} className="login-btn">
            Logout
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Suggestion</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.phone}</td>
                <td>{item.email}</td>
                <td>{item.suggestion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;