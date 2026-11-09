
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const response = await API.get("/complaints/my");

      const data = response.data;

      setComplaints(
        Array.isArray(data)
          ? data
          : data.complaints || []
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to load complaints."
      );
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Handle form input
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

  // Update status
  const handleStatusChange = async (id, status) => {
    try {
      setMessage("");

      const response = await API.put(
        `/complaints/${id}/status`,
        { status }
      );

      setMessage(
        response.data.message ||
        "Complaint status updated!"
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

  // Delete complaint
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmed) return;

    try {
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

  // Display friendly status
  const displayStatus = (status) => {
    if (status === "In Progress") return "Ongoing";
    if (status === "Resolved") return "Completed";
    return status;
  };

  // Status class
  const statusClass = (status) => {
    if (status === "In Progress") return "ongoing";
    if (status === "Resolved") return "completed";
    return "pending";
  };

  // Category icon
  const categoryIcon = (category) => {
    const icons = {
      Infrastructure: "🏗️",
      Electrical: "💡",
      Water: "🚰",
      Internet: "📶",
      Cleanliness: "🧹",
      Hostel: "🏠",
      Other: "📌"
    };

    return icons[category] || "📌";
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title?.toLowerCase().includes(search.toLowerCase()) ||
      complaint.location?.toLowerCase().includes(search.toLowerCase()) ||
      complaint.category?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalComplaints = complaints.length;

  const pendingCount = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const ongoingCount = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const completedCount = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  return (
    <div className="campus-dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="brand-icon">F</div>

          <div>
            <h2>FixMyCampus</h2>
            <span>Campus Solutions</span>
          </div>
        </div>

        <div className="sidebar-label">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">
          <a href="#dashboard" className="nav-item active">
            <span>📊</span> Dashboard
          </a>

          <a href="#submit-complaint" className="nav-item">
            <span>📝</span> Submit Complaint
          </a>

          <a href="#my-complaints" className="nav-item">
            <span>📋</span> My Complaints
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-icon">💬</span>
            <h4>Need Help?</h4>
            <p>Report campus issues and help make your campus better.</p>
          </div>

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            ↪ Logout
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content" id="dashboard">

        {/* TOPBAR */}
        <header className="topbar">
          <div>
            <h2>Student Dashboard</h2>
            <p>Campus Complaint Management System</p>
          </div>

          <div className="topbar-user">
            <div className="user-avatar">
              {(user.name || "S").charAt(0).toUpperCase()}
            </div>

            <div className="user-info">
              <strong>{user.name || "Student"}</strong>
              <span>Student Portal</span>
            </div>
          </div>
        </header>

        {/* WELCOME BANNER */}
        <section className="welcome-banner">

          <div className="welcome-text">
            <span className="welcome-tag">
              YOUR CAMPUS, YOUR VOICE
            </span>

            <h1>
              Welcome back, {user.name?.split(" ")[0] || "Student"}!
            </h1>

            <p>
              Together, let's make your campus cleaner,
              safer and better.
            </p>

            <a
              href="#submit-complaint"
              className="welcome-button"
            >
              + Report a Campus Issue
            </a>
          </div>

          <div className="welcome-illustration">
            <div className="illustration-circle">
              🏫
            </div>
            <span>Better Campus</span>
            <span>Better Future</span>
          </div>

        </section>

        {/* STATISTICS */}
        <section className="statistics-section">

          <div className="section-title">
            <h2>Complaint Overview</h2>
            <p>Track all your campus complaints</p>
          </div>

          <div className="stats-grid">

            <div className="stat-card total-stat">
              <div className="stat-icon">📋</div>
              <div>
                <span>Total Complaints</span>
                <h2>{totalComplaints}</h2>
                <small>All reported issues</small>
              </div>
            </div>

            <div className="stat-card pending-stat">
              <div className="stat-icon">⏳</div>
              <div>
                <span>Pending</span>
                <h2>{pendingCount}</h2>
                <small>Waiting for action</small>
              </div>
            </div>

            <div className="stat-card ongoing-stat">
              <div className="stat-icon">🔧</div>
              <div>
                <span>Ongoing</span>
                <h2>{ongoingCount}</h2>
                <small>Being worked on</small>
              </div>
            </div>

            <div className="stat-card completed-stat">
              <div className="stat-icon">✅</div>
              <div>
                <span>Completed</span>
                <h2>{completedCount}</h2>
                <small>Issues resolved</small>
              </div>
            </div>

          </div>
        </section>

        {/* SUBMIT COMPLAINT */}
        <section
          className="content-card submit-section"
          id="submit-complaint"
        >

          <div className="section-title">
            <div>
              <h2>Report a Campus Issue</h2>
              <p>Help us improve your campus facilities.</p>
            </div>

            <div className="section-icon">📝</div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Complaint Title</label>

              <input
                type="text"
                name="title"
                placeholder="e.g. Broken classroom projector"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Describe the issue in detail..."
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
                <label>Campus Location</label>

                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Block B, Room 204"
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
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Complaint →"}
            </button>

          </form>
        </section>

        {/* MY COMPLAINTS */}
        <section
          className="content-card complaints-section"
          id="my-complaints"
        >

          <div className="section-title">
            <div>
              <h2>My Complaints</h2>
              <p>Monitor the progress of your reported issues.</p>
            </div>

            <button
              className="refresh-button"
              onClick={fetchComplaints}
            >
              ↻ Refresh
            </button>
          </div>

          {/* SEARCH AND FILTER */}
          <div className="complaint-toolbar">

            <input
              type="text"
              placeholder="🔍 Search by title, location or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">Ongoing</option>
              <option value="Resolved">Completed</option>
            </select>

          </div>

          {/* COMPLAINT LIST */}
          {filteredComplaints.length === 0 ? (

            <div className="empty-state">
              <div>📭</div>
              <h3>No complaints found</h3>
              <p>
                Submit a complaint or change your search filters.
              </p>
            </div>

          ) : (

            <div className="complaints-list">

              {filteredComplaints.map((complaint) => (

                <article
                  className="complaint-card"
                  key={complaint._id}
                >

                  <div className="complaint-card-header">

                    <div className="complaint-heading">
                      <div className="category-icon">
                        {categoryIcon(complaint.category)}
                      </div>

                      <div>
                        <h3>{complaint.title}</h3>

                        <span className="complaint-meta">
                          {complaint.category} • {complaint.location}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`status-badge ${statusClass(complaint.status)}`}
                    >
                      {displayStatus(complaint.status)}
                    </span>

                  </div>

                  <p className="complaint-description">
                    {complaint.description}
                  </p>

                  <div className="complaint-details">

                    <span>
                      <strong>Priority:</strong>{" "}
                      <span className={`priority-${complaint.priority?.toLowerCase()}`}>
                        {complaint.priority}
                      </span>
                    </span>

                    <span>
                      <strong>Submitted:</strong>{" "}
                      {complaint.createdAt
                        ? new Date(complaint.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>

                  </div>

                  {/* PROGRESS TRACKER */}
                  <div className="progress-tracker">

                    <div
                      className={`progress-step ${
                        ["Pending", "In Progress", "Resolved"].includes(
                          complaint.status
                        ) ? "step-active" : ""
                      }`}
                    >
                      <div className="progress-circle">1</div>
                      <span>Submitted</span>
                    </div>

                    <div
                      className={`progress-line ${
                        ["In Progress", "Resolved"].includes(
                          complaint.status
                        ) ? "line-active" : ""
                      }`}
                    />

                    <div
                      className={`progress-step ${
                        ["In Progress", "Resolved"].includes(
                          complaint.status
                        ) ? "step-active" : ""
                      }`}
                    >
                      <div className="progress-circle">2</div>
                      <span>Ongoing</span>
                    </div>

                    <div
                      className={`progress-line ${
                        complaint.status === "Resolved"
                          ? "line-active" : ""
                      }`}
                    />

                    <div
                      className={`progress-step ${
                        complaint.status === "Resolved"
                          ? "step-active" : ""
                      }`}
                    >
                      <div className="progress-circle">3</div>
                      <span>Completed</span>
                    </div>

                  </div>

                  {/* STATUS UPDATE */}
                  <div className="complaint-actions">

                    <div className="status-update">
                      <label>Update Status</label>

                      <select
                        value={complaint.status}
                        onChange={(e) =>
                          handleStatusChange(
                            complaint._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">Ongoing</option>
                        <option value="Resolved">Completed</option>
                      </select>
                    </div>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(complaint._id)}
                    >
                      🗑 Delete Complaint
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">
          <p>
            © 2026 FixMyCampus | Making Your Campus a Better Place
          </p>
        </footer>

      </main>

    </div>
  );
}

export default Dashboard;
