import { NextRequest, NextResponse } from "next/server";
import { Client } from "ssh2";
import { connectionManager } from "@/app/api/lib/connectionManager";
import { executeSSHCommand } from "@/lib/api/lib/ethPillarCLI";
import { parseErrorMessage } from "@/app/api/lib/utils";

const ALLOWED_CLIENT_TYPES = ["execution", "consensus"];

// Helper function to get the correct flag based on client
async function getClientInfo(
  sshClient: Client,
  clientType: string
): Promise<{ clientName: string; flag: string; filePath: string } | null> {
  const service = clientType;
  const filePath = `/etc/systemd/system/${service}.service`;
  try {
    // Get description line to determine client name
    const descCommand = `grep Description= ${filePath} | head -n 1`;
    const descOutput = await executeSSHCommand(sshClient, descCommand);
    const clientName = descOutput
      .split("=")[1]
      ?.split(" ")[0]
      ?.trim()
      .toLowerCase();

    if (!clientName) return null;

    let flag = "";
    if (clientType === "execution") {
      switch (clientName) {
        case "nethermind":
          flag = "--JsonRpc.Host";
          break;
        case "besu":
          flag = "--rpc-http-host";
          break;
        case "geth":
          flag = "--http.addr";
          break;
        case "erigon":
          flag = "--http.addr";
          break;
        case "reth":
          flag = "--http.addr";
          break;
        default:
          return null;
      }
    } else if (clientType === "consensus") {
      switch (clientName) {
        case "nimbus":
          flag = "--rest-address";
          break;
        case "teku":
          flag = "--rest-api-interface";
          break;
        case "lighthouse":
          flag = "--http-address";
          break;
        case "prysm":
          flag = "--rpc-host";
          break;
        case "lodestar":
          flag = "--rest.address";
          break;
        default:
          return null;
      }
    }
    return { clientName, flag, filePath };
  } catch (error) {
    console.error(`Error getting client info for ${clientType}:`, error);
    return null; // Indicate client couldn't be determined
  }
}

export async function POST(req: NextRequest) {
  try {
    const { clientType, expose } = await req.json(); // expose: boolean

    if (!ALLOWED_CLIENT_TYPES.includes(clientType)) {
      return NextResponse.json(
        { message: "Invalid client type for RPC expose" },
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
    const clientInfo = await getClientInfo(sshClient, clientType);

    if (!clientInfo) {
      return NextResponse.json(
        { message: `Could not determine ${clientType} client or flag.` },
        { status: 400 }
      );
    }

    const { flag, filePath } = clientInfo;
    const newValue = expose ? "0.0.0.0" : "127.0.0.1";
    const backupPath = `${filePath}.bak_${Date.now()}`;

    // Command sequence to safely modify the file (inspired by _updateFlagAndRestartService in functions.sh)
    const command = `
      sudo cp ${filePath} ${backupPath} && \\
      if grep -q 'ExecStart.*\\\\$' ${filePath}; then
          echo "Multiline config detected for ${filePath}" >&2 && \\
          # Multiline: Remove existing flag/value line
          sudo sed -i -r '/${flag}[= ]+[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}/d' ${filePath} && \\
          # Add new flag/value on a new line before the last line
          sudo sed -i '$i \\  ${flag}=${newValue} \\\\' ${filePath}
      else
          echo "Single line config detected for ${filePath}" >&2 && \\
          # Single Line: Remove existing flag/value pair using regex for flexibility
          sudo sed -i -r 's|${flag}[= ]+[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}||g' ${filePath} && \\
          # Append new flag/value to the end of the ExecStart line
          sudo sed -i -e 's|^ExecStart=.*$|& ${flag}=${newValue}|' ${filePath}
      fi && \\
      sudo systemctl daemon-reload && \\
      sudo systemctl restart ${clientType}.service && \\
      echo "Service file updated and ${clientType} restarted."
    `;

    console.log(
      `Executing RPC expose command for session ${sessionId}:`,
      command
    );
    const output = await executeSSHCommand(sshClient, command);
    console.log(`RPC expose output for session ${sessionId}: ${output}`);

    // Check output - can be complex, rely on command exit status mostly
    return NextResponse.json({
      success: true,
      message: `Successfully ${
        expose ? "exposed" : "closed"
      } ${clientType} RPC port. Service restarted.`,
      output,
    });
  } catch (error: any) {
    console.error("Expose RPC error:", error);
    const message = parseErrorMessage(error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
