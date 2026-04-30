import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import API from "../services/api"

function DiscussionThreadPage() {
  const { threadId } = useParams()

  const [thread, setThread] = useState(null)
  const [body, setBody] = useState("")
  const [error, setError] = useState("")

  const loadThread = async () => {
    try {
      setError("")
      const res = await API.get(`/discussions/thread/${threadId}`)
      setThread(res.data)
    } catch (err) {
      setError(err.response?.data?.message || "Could not load discussion thread")
    }
  }

  useEffect(() => {
    loadThread()
  }, [threadId])

  const handleReply = async (e) => {
    e.preventDefault()

    try {
      setError("")

      await API.post(`/discussions/thread/${threadId}/replies`, {
        body,
      })

      setBody("")
      loadThread()
    } catch (err) {
      setError(err.response?.data?.message || "Could not add reply")
    }
  }

  if (!thread) {
    return (
      <div style={{ padding: "40px" }}>
        <p>Loading discussion...</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    )
  }

  return (
    <div style={{ padding: "40px" }}>
      <Link to={-1}>← Back to Discussions</Link>

      <h1>{thread.title}</h1>
      <p>{thread.body}</p>

      <hr />

      <h2>Replies</h2>

      {thread.replies.length === 0 ? (
        <p>No replies yet.</p>
      ) : (
        thread.replies.map((reply) => (
          <div
            key={reply._id}
            style={{
              padding: "15px",
              marginBottom: "10px",
              background: "white",
              borderRadius: "8px",
            }}
          >
            <p>{reply.body}</p>
          </div>
        ))
      )}

      <form onSubmit={handleReply} style={{ marginTop: "25px" }}>
        <label>Write a reply</label>

        <textarea
          placeholder="Type your reply here"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          style={{
            display: "block",
            width: "500px",
            height: "100px",
            padding: "10px",
            marginTop: "8px",
          }}
        />

        <button type="submit" style={{ marginTop: "10px" }}>
          Reply
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}

export default DiscussionThreadPage