import { NextRequest, NextResponse } from "next/server";
import { connectionManager } from "@/app/api/lib/connectionManager";
import { executeSSHCommand } from "@/lib/api/lib/ethPillarCLI";
import { parseErrorMessage } from "@/app/api/lib/utils";

const ALLOWED_SERVICES = [
  "execution",
  "consensus",
  "validator",
  "mevboost",
  "csm_nimbusvalidator",
];

export async function POST(req: NextRequest) {
  try {
    const { service } = await req.json();

    if (!ALLOWED_SERVICES.includes(service)) {
      return NextResponse.json(
        { message: "Invalid service name" },
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

    const filePath = `/etc/systemd/system/${service}.service`;
    const command = `cat ${filePath}`; // Simple cat command

    console.log(`Executing command for session ${sessionId}: ${command}`);
    const fileContent = await executeSSHCommand(sshClient, command);

    return NextResponse.json({ success: true, content: fileContent });
  } catch (error: any) {
    console.error("Get config error:", error);
    const message = parseErrorMessage(error);
    // Check if the error indicates file not found
    if (message.toLowerCase().includes("no such file")) {
      return NextResponse.json(
        { success: false, message: "Configuration file not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
