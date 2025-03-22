import { z } from "zod";

export const sshAuthSchema = z
  .object({
    host: z.string().min(1, "Server IP/Hostname is required"),
    port: z.coerce.number().int().min(1).max(65535).default(22),
    username: z.string().min(1, "Username is required"),
    authMethod: z.enum(["password", "privateKey"], {
      required_error: "Authentication method is required",
    }),
    password: z.string().optional(),
    privateKey: z.string().optional(),
    // Only validate password if authMethod is password
    // Only validate privateKey if authMethod is privateKey
  })
  .refine(
    (data) => {
      if (data.authMethod === "password") {
        return !!data.password;
      }
      if (data.authMethod === "privateKey") {
        return !!data.privateKey;
      }
      return true;
    },
    {
      message:
        "Please provide either a password or private key based on your selected authentication method",
      path: ["password", "privateKey"],
    }
  );

export type SSHAuthInput = z.infer<typeof sshAuthSchema>;
