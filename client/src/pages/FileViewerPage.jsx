import { useSearchParams } from "react-router-dom"

function FileViewerPage() {
  const [searchParams] = useSearchParams()
  const fileUrl = searchParams.get("url")
  const title = searchParams.get("title") || "File Viewer"

  if (!fileUrl) {
    return (
      <div className="assignment-page-shell">
        <div className="assignment-page-content">
          <div className="info-card">
            <h2 className="info-card-title">No file selected</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="assignment-page-shell">
      <div className="course-hero">
        <div className="course-hero-content">
          <p className="course-hero-label">File</p>
          <h1 className="course-hero-title">{title}</h1>
        </div>
      </div>

      <div className="assignment-page-content">
        <div className="pdf-viewer-card">
          <iframe src={fileUrl} className="pdf-viewer" title={title} />
        </div>
      </div>
    </div>
  )
}

export default FileViewerPage