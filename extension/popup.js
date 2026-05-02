const chatBox = document.getElementById("chatBox")
const questionInput = document.getElementById("questionInput")
const sendBtn = document.getElementById("sendBtn")

let currentContext = null

function addMessage(text, sender) {
  const div = document.createElement("div")
  div.className = `${sender} message`
  div.textContent = text
  chatBox.appendChild(div)
  chatBox.scrollTop = chatBox.scrollHeight
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  return tabs[0]
}

async function loadContext() {
  const tab = await getActiveTab()

  const response = await chrome.tabs.sendMessage(tab.id, {
    type: "GET_LMS_CONTEXT"
  })

  if (!response.success) {
    throw new Error(response.error)
  }

  currentContext = response.context
}

async function sendQuestion() {
  const question = questionInput.value.trim()
  if (!question) return

  addMessage(question, "user")
  questionInput.value = ""

  const thinkingMessage = document.createElement("div")
  thinkingMessage.className = "bot message"
  thinkingMessage.textContent = "Thinking..."
  chatBox.appendChild(thinkingMessage)
  chatBox.scrollTop = chatBox.scrollHeight

  try {
    if (!currentContext) {
      await loadContext()
    }

    const res = await fetch("http://localhost:6001/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question,
        context: currentContext
      })
    })

    const data = await res.json()

    thinkingMessage.textContent =
      data.answer || data.error || "Something went wrong."
  } catch (error) {
    thinkingMessage.textContent = error.message
  }
}

sendBtn.addEventListener("click", sendQuestion)

questionInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendQuestion()
  }
})