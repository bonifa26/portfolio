import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const res = await fetch("http://localhost:5000/api/contact");
    const data = await res.json();
    setContacts(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  const exportFile = async (type) => {
  const res = await fetch(`http://localhost:5000/api/contact/export/${type}`);

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const fileName =
    type === "excel"
      ? "contacts.xlsx"
      : type === "csv"
      ? "contacts.csv"
      : "contacts.json";

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="export-buttons">
          <button onClick={() => exportFile("csv")}>Download CSV</button>
          <button onClick={() => exportFile("excel")}>Download Excel</button>
          <button onClick={() => exportFile("json")}>Download JSON</button>
          <button onClick={() => exportFile("pdf")}>Download PDF</button>
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