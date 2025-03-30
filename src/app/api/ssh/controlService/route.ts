import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define validation schema
const ControlServiceSchema = z.object({
  service: z.string().min(1),
  action: z.enum(["start", "stop", "restart"]),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = ControlServiceSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validatedData.error.format(),
        },
        { status: 400 }
      );
    }

    const { service, action } = validatedData.data;

    // Verify session token
    const sessionToken = request.cookies.get("ssh_session")?.value;
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    // Build the systemctl command based on the action
    let command = "";
    switch (action) {
      case "start":
        command = `sudo systemctl start ${service}`;
        break;
      case "stop":
        command = `sudo systemctl stop ${service}`;
        break;
      case "restart":
        command = `sudo systemctl restart ${service}`;
        break;
    }

    // Execute the command using the ssh/execute API route
    const response = await fetch(new URL("/api/ssh/execute", request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `ssh_session=${sessionToken}`,
      },
      body: JSON.stringify({ command }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || "Failed to execute command", command },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Service ${service} ${action} command executed successfully`,
      details: {
        output: result.output,
        command,
      },
    });
  } catch (error: any) {
    console.error("Error controlling service:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
