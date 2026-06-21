import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    email: "",
    suggestion: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const res = await fetch("http://localhost:5000/api/contact");
    const data = await res.json();
    setContacts(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditData({
      name: item.name,
      phone: item.phone,
      email: item.email,
      suggestion: item.suggestion,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (id) => {
    const res = await fetch(`http://localhost:5000/api/contact/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    });

    const data = await res.json();

    if (data.success) {
      alert("Contact updated successfully");
      setEditingId(null);
      fetchContacts();
    } else {
      alert(data.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");

    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:5000/api/contact/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Contact deleted successfully");
      fetchContacts();
    } else {
      alert(data.message);
    }
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
        <p>Hi bonifa🖐</p>
        <div className="export-buttons">
          
          <button onClick={() => exportFile("csv")}>Export CSV</button>
          <button onClick={() => exportFile("excel")}>Export Excel</button>
          <button onClick={() => exportFile("json")}>Export JSON</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Suggestion</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map((item) => (
              <tr key={item._id}>
                {editingId === item._id ? (
                  <>
                    <td>
                      <input
                        name="name"
                        value={editData.name}
                        onChange={handleChange}
                      />
                    </td>

                    <td>
                      <input
                        name="phone"
                        value={editData.phone}
                        onChange={handleChange}
                      />
                    </td>

                    <td>
                      <input
                        name="email"
                        value={editData.email}
                        onChange={handleChange}
                      />
                    </td>

                    <td>
                      <input
                        name="suggestion"
                        value={editData.suggestion}
                        onChange={handleChange}
                      />
                    </td>

                    <td>
                      <button className="save-btn" onClick={() => handleUpdate(item._id)}>
                        Save
                      </button>

                      <button className="cancel-btn" onClick={handleCancel}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                    <td>{item.suggestion}</td>

                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(item)}>
                        Edit
                      </button>

                      <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;