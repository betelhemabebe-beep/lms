chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_LMS_CONTEXT") {
    getLmsContext()
      .then((context) => sendResponse({ success: true, context }))
      .catch((error) => sendResponse({ success: false, error: error.message }))

    return true
  }
})

async function getLmsContext() {
  const savedUser = localStorage.getItem("user")
  const user = savedUser ? JSON.parse(savedUser) : null

  if (!user?.token) {
    throw new Error("User is not logged in.")
  }

  const url = new URL(window.location.href)
  const path = url.pathname

  let apiUrl = ""

  if (path.startsWith("/module/")) {
    const moduleId = path.split("/")[2]
    apiUrl = `http://localhost:5000/api/context?pageType=module&moduleId=${moduleId}`
  } else if (path.startsWith("/assignment/")) {
    const assignmentId = path.split("/")[2]
    apiUrl = `http://localhost:5000/api/context?pageType=assignment&assignmentId=${assignmentId}`
  } else if (path.startsWith("/course/")) {
    const courseId = path.split("/")[2]
    apiUrl = `http://localhost:5000/api/context?pageType=course&courseId=${courseId}`
  } else if (path.startsWith("/file-viewer")) {
    const fileUrl = url.searchParams.get("url")
    apiUrl = `http://localhost:5000/api/context?pageType=dashboard`

    return {
      pageType: "file-viewer",
      file: {
        fileUrl,
        title: url.searchParams.get("title") || "File"
      }
    }
  } else {
    apiUrl = "http://localhost:5000/api/context?pageType=dashboard"
  }

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  })

  return await res.json()
}