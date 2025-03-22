import { NextRequest, NextResponse } from "next/server";
import { connectionManager } from "../../lib/connectionManager";
import { parseErrorMessage } from "../../lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { host, username, password, port } = await req.json();

    if (!host || !username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Connection failed",
          message: "Missing required connection parameters",
        },
        { status: 400 }
      );
    }

    const sessionId = await connectionManager.createConnection({
      host,
      username,
      password,
      port,
      lastAccessed: Date.now(),
    });

    const apiResponse = NextResponse.json({
      success: true,
      sessionId: sessionId,
    });

    apiResponse.cookies.set("ssh_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 10200, // 2 hour
    });

    return apiResponse;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Connection failed",
        message:
          error instanceof Error
            ? parseErrorMessage(error.message)
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}
