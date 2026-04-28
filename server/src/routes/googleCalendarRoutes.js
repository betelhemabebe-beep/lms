import express from "express";
import { google } from "googleapis";
import Assignment from "../modules/assignments/assignment.model.js";

let savedTokens = null;

const router = express.Router();

function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

router.get("/auth", (req, res) => {
  const oauth2Client = createOAuthClient();

  console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });

  console.log("AUTH URL:", url);
res.send(`<a href="${url}">Click here to connect Google Calendar</a>`);
});

router.get("/callback", async (req, res) => {
  const oauth2Client = createOAuthClient();
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    savedTokens = tokens;
    oauth2Client.setCredentials(tokens);

    res.send("Google Calendar connected successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error connecting to Google Calendar");
  }
});

router.post("/sync-test", async (req, res) => {
  if (!savedTokens) {
    return res.status(401).json({ message: "Google Calendar is not connected yet" });
  }

  try {
    const oauth2Client = createOAuthClient();
    oauth2Client.setCredentials(savedTokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: "LMS Test Assignment",
      description: "Test event created from LMS calendar sync",
      start: {
        dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      },
      end: {
        dateTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
      },
    };

    const createdEvent = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    res.json({
      message: "Test event synced to Google Calendar",
      eventLink: createdEvent.data.htmlLink,
    });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ message: "Failed to sync test event" });
  }
});

router.post("/sync-assignments", async (req, res) => {
  if (!savedTokens) {
    return res.status(401).json({
      message: "Google Calendar is not connected yet"
    });
  }

  try {
    const oauth2Client = createOAuthClient();
    oauth2Client.setCredentials(savedTokens);

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    const assignments = await Assignment.find({
      deadline: { $exists: true, $ne: null }
    })
      .populate("course", "name")
      .populate("module", "title");

    let count = 0;

    for (const assignment of assignments) {
      const startTime = new Date(assignment.deadline);
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

      const event = {
        summary: `${assignment.title}`,
        description: `Course: ${
          assignment.course?.name || "Unknown"
        }`,
        start: {
          dateTime: startTime.toISOString(),
        },
        end: {
          dateTime: endTime.toISOString(),
        },
      };

      await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });

      count++;
    }

    res.json({
      message: "Assignments synced to Google Calendar",
      totalAssignmentsSynced: count,
    });

  } catch (error) {
    console.error("Sync assignments error:", error);

    res.status(500).json({
      message: "Failed to sync assignments",
    });
  }
});

export default router;