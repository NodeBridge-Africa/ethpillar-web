import { NextRequest, NextResponse } from "next/server";
import { connectionManager } from "@/app/api/lib/connectionManager";
import { executeSSHCommand } from "@/lib/api/lib/ethPillarCLI";
import { parseErrorMessage } from "@/app/api/lib/utils";

const ALLOWED_CLIENT_TYPES = ["execution", "consensus"]; // Only these clients support resync

export async function POST(req: NextRequest) {
  try {
    const { clientType } = await req.json(); // e.g., "execution"

    if (!ALLOWED_CLIENT_TYPES.includes(clientType)) {
      return NextResponse.json(
        { message: "Invalid client type for resync" },
        { status: 400 }
      );
    }

    const sessionId = req.cookies.get("ssh_session")?.value;
    if (!sessionId) {
      return NextResponse.json(
        { message: "Unauthorized: No session" },
        { status: 401 }
      );
    }

    const sshClient = await connectionManager.getConnection(sessionId);

    // Execute the resync script
    const command = `cd ~/git/ethpillar && bash ./resync_${clientType}.sh --confirm-resync`;
    // Adding a --confirm-resync flag assuming we can modify the script to support non-interactive mode
    // If this flag isn't supported in the script, the command might hang waiting for input

    console.log(
      `Executing resync command for session ${sessionId}: ${command}`
    );
    const output = await executeSSHCommand(sshClient, command);
    console.log(`Resync command output for session ${sessionId}: ${output}`);

    // Check output for success/error
    let success = true;
    let message = `${clientType} resync process initiated. Check logs for details.`;
    if (output.toLowerCase().includes("error")) {
      message = `Resync process for ${clientType} finished with potential issues. Check logs.`;
    }

    return NextResponse.json({ success, message, output });
  } catch (error: any) {
    console.error("Resync client error:", error);
    const message = parseErrorMessage(error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
