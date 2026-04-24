function Modal({ title, children }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export default Modal