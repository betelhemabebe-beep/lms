function PageHeader({ label, title }) {
  return (
    <div className="course-hero">
      <div className="course-hero-content">
        {label && <p className="course-hero-label">{label}</p>}
        <h1 className="course-hero-title">{title}</h1>
      </div>
    </div>
  )
}

export default PageHeader