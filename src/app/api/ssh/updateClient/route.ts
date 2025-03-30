import { NextRequest, NextResponse } from "next/server";
import { connectionManager } from "@/app/api/lib/connectionManager";
import { executeSSHCommand } from "@/lib/api/lib/ethPillarCLI";
import { parseErrorMessage } from "@/app/api/lib/utils";

const ALLOWED_CLIENT_TYPES = [
  "execution",
  "consensus",
  "mevboost",
  "validator",
];

export async function POST(req: NextRequest) {
  try {
    const { clientType } = await req.json(); // e.g., "execution"

    if (!ALLOWED_CLIENT_TYPES.includes(clientType)) {
      return NextResponse.json(
        { message: "Invalid client type" },
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

    // Execute the script from the correct directory
    const command = `cd ~/git/ethpillar && bash ./update_${clientType}.sh`;

    console.log(
      `Executing update command for session ${sessionId}: ${command}`
    );
    // Execute command - this might take time, the client should show loading
    const output = await executeSSHCommand(sshClient, command);
    console.log(`Update command output for session ${sessionId}: ${output}`);

    // Check output for common success/error indicators
    let success = true;
    let message = `${clientType} update process initiated. Check logs for details.`;
    if (output.toLowerCase().includes("error")) {
      // Basic error check in output
      message = `Update process for ${clientType} finished with potential issues. Check logs.`;
    }

    return NextResponse.json({ success, message, output });
  } catch (error: any) {
    console.error("Update client error:", error);
    const message = parseErrorMessage(error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
