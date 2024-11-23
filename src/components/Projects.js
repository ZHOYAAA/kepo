import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject({ ...currentProject, [name]: value });
  };

  // Save new or edited project
  const handleSave = () => {
    if (
      !currentProject.name.trim() ||
      !currentProject.description.trim() ||
      !currentProject.category.trim()
    ) {
      setError("All fields are required.");
      return;
    }

    if (editIndex !== null) {
      const updatedProjects = [...projects];
      updatedProjects[editIndex] = currentProject;
      setProjects(updatedProjects);
    } else {
      setProjects([...projects, currentProject]);
    }

    setCurrentProject({ name: "", description: "", category: "" });
    setEditIndex(null);
    setShowModal(false);
    setError("");
  };

  // Delete project
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  // Open modal for add/edit
  const openModal = (
    project = { name: "", description: "", category: "" },
    index = null
  ) => {
    setCurrentProject(project);
    setEditIndex(index);
    setShowModal(true);
  };

  // Filter projects by search query
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  return (
    <div className="min-vh-100 bg-dark text-light py-4">
      <div className="container">
        <h1 className="text-center display-4 mb-4">
          My Recent <span className="text-success">Works</span>
        </h1>
        <p className="text-center text-muted">
          Here are a few projects I've worked on recently.
        </p>

        {/* Search Bar */}
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={() => setSearchQuery("")}>
            Clear
          </button>
        </div>

        {/* Add New Project Button */}
        <div className="d-flex justify-content-between mb-4">
          <button className="btn btn-success" onClick={() => openModal()}>
            Add New Project
          </button>
          <p className="text-muted">
            Total Projects: {filteredProjects.length}
          </p>
        </div>

        {/* Projects List */}
        <div className="row">
          {currentProjects.map((project, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card bg-secondary text-light shadow">
                <div className="card-body">
                  <h5 className="card-title">{project.name}</h5>
                  <p className="card-text">
                    <span className="badge bg-info">{project.category}</span>
                  </p>
                  <p className="card-text">{project.description}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openModal(project, index)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(index)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  className={`page-item ${
                    i + 1 === currentPage ? "active" : ""
                  }`}
                  key={i}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {filteredProjects.length === 0 && (
          <p className="text-center text-muted mt-4">
            No projects match your search.
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editIndex !== null ? "Edit Project" : "Add Project"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <form>
                  <div className="mb-3">
                    <label htmlFor="projectName" className="form-label">
                      Project Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="projectName"
                      name="name"
                      value={currentProject.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="projectCategory" className="form-label">
                      Category
                    </label>
                    <select
                      className="form-select"
                      id="projectCategory"
                      name="category"
                      value={currentProject.category}
                      onChange={handleInputChange}>
                      <option value="">Select Category</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="Game Development">Game Development</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="projectDescription" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="projectDescription"
                      name="description"
                      rows="3"
                      value={currentProject.description}
                      onChange={handleInputChange}></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
