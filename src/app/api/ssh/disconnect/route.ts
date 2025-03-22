import { NextRequest, NextResponse } from "next/server";
import { connectionManager } from "../../lib/connectionManager";

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("ssh_session")?.value;
    if (!sessionId) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }
    await connectionManager.closeConnection(sessionId);

    const apiResponse = NextResponse.json({ success: true });
    apiResponse.cookies.delete("ssh_session");

    return apiResponse;
  } catch (error) {
    return NextResponse.json(
      {
        error: "Disconnect failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}
