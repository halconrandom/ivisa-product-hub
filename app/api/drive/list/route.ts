import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.list({
    pageSize: 50,
    fields: "files(id, name, mimeType, modifiedTime, owners, iconLink, webViewLink)",
  });

  console.log("📁 Files returned from Google Drive:", res.data.files); // <-- Add this

  return NextResponse.json(res.data.files);
}
