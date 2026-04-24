import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"
import PageHeader from "../components/common/PageHeader"
import Modal from "../components/common/Modal"

function ModulePage() {
  const { moduleId } = useParams()
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [showFileModal, setShowFileModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)

  const [fileTitle, setFileTitle] = useState("")
  const [moduleFile, setModuleFile] = useState(null)

  const [assignmentTitle, setAssignmentTitle] = useState("")
  const [deadline, setDeadline] = useState("")
  const [instructionFile, setInstructionFile] = useState(null)
  const [rubricFile, setRubricFile] = useState(null)
  const [error, setError] = useState("")

  const isPdf = (url) => {
    return url?.toLowerCase().includes(".pdf")
  }

  const getFileLink = (url, title) => {
    if (isPdf(url)) {
      return `/file-viewer?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
    }

    return url
  }

  const uploadFile = async (file, type) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    const res = await API.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    return res.data
  }

  const loadContent = async () => {
    const res = await API.get(`/module-content/module/${moduleId}`)
    setItems(res.data)
  }

  useEffect(() => {
    loadContent()
  }, [moduleId])

  const handleCreateFile = async (e) => {
    e.preventDefault()
    setError("")

    try {
      if (!moduleFile) {
        setError("Please choose a file")
        return
      }

      const uploaded = await uploadFile(moduleFile, "module-file")

      await API.post("/module-content/file", {
        moduleId,
        title: fileTitle || uploaded.originalName,
        fileName: uploaded.originalName,
        fileUrl: uploaded.fileUrl
      })

      setFileTitle("")
      setModuleFile(null)
      setShowFileModal(false)
      loadContent()
    } catch (err) {
      setError(err.response?.data?.message || "Could not upload file")
    }
  }

  const handleCreateAssignment = async (e) => {
    e.preventDefault()
    setError("")

    try {
      if (!instructionFile || !rubricFile) {
        setError("Instruction file and rubric file are required")
        return
      }

      const uploadedInstruction = await uploadFile(instructionFile, "assignment-file")
      const uploadedRubric = await uploadFile(rubricFile, "assignment-file")

      await API.post("/assignments", {
        title: assignmentTitle,
        deadline,
        instructionFile: uploadedInstruction.fileUrl,
        rubricFile: uploadedRubric.fileUrl,
        moduleId
      })

      setAssignmentTitle("")
      setDeadline("")
      setInstructionFile(null)
      setRubricFile(null)
      setShowAssignmentModal(false)
      loadContent()
    } catch (err) {
      setError(err.response?.data?.message || "Could not create assignment")
    }
  }

  return (
    <div className="module-page-shell">
      <PageHeader label="Module" title="Module Content" />

      <div className="module-page-content">
        <div className="section-header section-header-row">
          <div>
            <h2 className="section-title">Module Content</h2>
            <p className="section-subtitle">
              Files and assignments appear here in creation order
            </p>
          </div>

          {user?.role === "instructor" && (
            <div className="module-actions">
              <button
                className="secondary-button"
                onClick={() => setShowFileModal(true)}
              >
                Upload File
              </button>

              <button
                className="create-button"
                onClick={() => setShowAssignmentModal(true)}
              >
                Create Assignment
              </button>
            </div>
          )}
        </div>

        <div className="content-list">
          {items.length === 0 && (
            <div className="content-row">
              <div className="content-row-left">
                <div className="content-row-text">
                  <span className="content-link">No content yet</span>
                  <p className="content-meta">Files and assignments will appear here.</p>
                </div>
              </div>
            </div>
          )}

          {items.map((item) => (
            <div key={item._id} className="content-row">
              <div className="content-row-left">
                <div
                  className={`content-badge ${
                    item.itemType === "assignment" ? "assignment-badge" : "file-badge"
                  }`}
                >
                  {item.itemType === "assignment" ? "Assignment" : "File"}
                </div>

                <div className="content-row-text">
                  {item.itemType === "assignment" ? (
                    <Link
                      to={
                        user?.role === "instructor"
                          ? `/instructor/assignment/${item.assignment?._id || item.assignment}`
                          : `/assignment/${item.assignment?._id || item.assignment}`
                      }
                      className="content-link"
                    >
                      {item.title}
                    </Link>
                  ) : isPdf(item.fileUrl) ? (
                    <Link
                      to={getFileLink(item.fileUrl, item.title)}
                      className="content-link"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="content-link"
                    >
                      {item.title}
                    </a>
                  )}

                  <p className="content-meta">
                    {item.itemType === "assignment" ? "Assignment" : item.fileName}
                  </p>
                </div>
              </div>

              {item.itemType === "assignment" ? (
                <Link
                  to={
                    user?.role === "instructor"
                      ? `/instructor/assignment/${item.assignment?._id || item.assignment}`
                      : `/assignment/${item.assignment?._id || item.assignment}`
                  }
                  className="row-action-button"
                >
                  Open
                </Link>
              ) : isPdf(item.fileUrl) ? (
                <Link
                  to={getFileLink(item.fileUrl, item.title)}
                  className="row-action-button"
                >
                  Open
                </Link>
              ) : (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="row-action-button"
                >
                  Open
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {showFileModal && (
        <Modal title="Upload File">
          {error && <div className="error-box">{error}</div>}

          <form className="modal-form" onSubmit={handleCreateFile}>
            <div className="auth-field">
              <label>Title</label>
              <input
                type="text"
                placeholder="Lecture 1 Slides"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label>File</label>
              <input
                type="file"
                onChange={(e) => setModuleFile(e.target.files[0])}
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowFileModal(false)}
              >
                Cancel
              </button>

              <button type="submit" className="create-button">
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showAssignmentModal && (
        <Modal title="Create Assignment">
          {error && <div className="error-box">{error}</div>}

          <form className="modal-form" onSubmit={handleCreateAssignment}>
            <div className="auth-field">
              <label>Assignment Title</label>
              <input
                type="text"
                placeholder="Homework 1"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label>Deadline</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label>Instruction File</label>
              <input
                type="file"
                onChange={(e) => setInstructionFile(e.target.files[0])}
              />
            </div>

            <div className="auth-field">
              <label>Rubric File</label>
              <input
                type="file"
                onChange={(e) => setRubricFile(e.target.files[0])}
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowAssignmentModal(false)}
              >
                Cancel
              </button>

              <button type="submit" className="create-button">
                Create
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default ModulePage