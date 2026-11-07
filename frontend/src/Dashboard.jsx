
import { useEffect, useState } from "react";
import API from "./services/api";
import "./Dashboard.css";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Infrastructure",
    location: "",
    priority: "Medium"
  });

  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch student's complaints
  const fetchComplaints = async () => {
    try {
      const response = await API.get("/complaints/my");

      setComplaints(
        Array.isArray(response.data)
          ? response.data
          : response.data.complaints || []
      );

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to load complaints."
      );
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await API.post(
        "/complaints",
        formData
      );

      setMessage(
        response.data.message ||
        "Complaint submitted successfully!"
      );

      setFormData({
        title: "",
        description: "",
        category: "Infrastructure",
        location: "",
        priority: "Medium"
      });

      await fetchComplaints();

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to submit complaint."
      );

    } finally {
      setLoading(false);
    }
  };

  // Update complaint status
  const handleStatusChange = async (id, status) => {
    try {
      setMessage("");

      const response = await API.put(
        `/complaints/${id}/status`,
        { status }
      );

      setMessage(
        response.data.message ||
        "Status updated successfully!"
      );

      await fetchComplaints();

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to update status."
      );

      await fetchComplaints();
    }
  };

  // Delete complaint in any status
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setMessage("");

      const response = await API.delete(
        `/complaints/${id}`
      );

      setMessage(
        response.data.message ||
        "Complaint deleted successfully!"
      );

      await fetchComplaints();

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to delete complaint."
      );
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  // Friendly status names
  const displayStatus = (status) => {
    if (status === "In Progress") return "Ongoing";
    if (status === "Resolved") return "Completed";
    return status;
  };

  return (
    <div className="dashboard">

      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h2>FixMyCampus</h2>
          <p>Campus Complaint Management System</p>
        </div>

        <div className="header-right">
          <span>Welcome, {user.name || "Student"}</span>
          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">

        {/* Message */}
        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {/* Submit Complaint */}
        <section className="form-section">

          <h2>Submit a Complaint</h2>
          <p>Report a campus issue to get it resolved.</p>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Complaint Title</label>

              <input
                type="text"
                name="title"
                placeholder="Enter complaint title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Describe your problem"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option>Infrastructure</option>
                  <option>Electrical</option>
                  <option>Water</option>
                  <option>Internet</option>
                  <option>Cleanliness</option>
                  <option>Hostel</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  placeholder="Enter campus location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Priority</label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Complaint"}
            </button>

          </form>
        </section>

        {/* My Complaints */}
        <section className="complaints-section">

          <div className="section-heading">
            <div>
              <h2>My Complaints</h2>
              <p>Track and update your complaint status.</p>
            </div>

            <button onClick={fetchComplaints}>
              Refresh
            </button>
          </div>

          {complaints.length === 0 ? (
            <p className="empty-message">
              No complaints submitted yet.
            </p>
          ) : (

            <div className="complaints-list">

              {complaints.map((complaint) => (

                <div
                  className="complaint-card"
                  key={complaint._id}
                >

                  {/* Complaint title and status */}
                  <div className="complaint-top">

                    <h3>{complaint.title}</h3>

                    <span
                      className={`status-badge ${complaint.status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {displayStatus(complaint.status)}
                    </span>

                  </div>

                  <p>
                    <strong>Category:</strong>{" "}
                    {complaint.category}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {complaint.location}
                  </p>

                  <p>
                    <strong>Priority:</strong>{" "}
                    {complaint.priority}
                  </p>

                  <p>
                    <strong>Description:</strong>{" "}
                    {complaint.description}
                  </p>

                  <p>
                    <strong>Submitted:</strong>{" "}
                    {complaint.createdAt
                      ? new Date(
                          complaint.createdAt
                        ).toLocaleDateString()
                      : "Not available"}
                  </p>

                  {/* Change Status */}
                  <div className="form-group">

                    <label>Update Complaint Status</label>

                    <select
                      value={complaint.status}
                      onChange={(e) =>
                        handleStatusChange(
                          complaint._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="In Progress">
                        Ongoing
                      </option>

                      <option value="Resolved">
                        Completed
                      </option>

                    </select>

                  </div>

                  {/* Delete button for ALL statuses */}
                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(complaint._id)
                    }
                  >
                    Delete Complaint
                  </button>

                </div>

              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Dashboard;
