import { connectToDatabase } from "@/lib/mongodb";
import { createEvent, getEvents } from "@/lib/models/event";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("POST /api/events - Unauthorized request");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const db = await connectToDatabase();
    const event = await req.json();

    console.log("POST /api/events - Creating event:", event);
    const result = await createEvent(db, {
      ...event,
      userId: session.user.email,
    });
    console.log("POST /api/events - Success:", result);

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error("POST /api/events - Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("GET /api/events - Unauthorized request");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const db = await connectToDatabase();
    console.log(
      "GET /api/events - Fetching events for user:",
      session.user.email
    );
    const events = await getEvents(db, session.user.email);
    console.log("GET /api/events - Found events:", events.length);

    return new Response(JSON.stringify(events), { status: 200 });
  } catch (error) {
    console.error("GET /api/events - Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
