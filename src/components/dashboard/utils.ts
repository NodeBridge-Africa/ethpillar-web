export function getStatusColor(status: string, isDot: boolean = false): string {
  switch (status) {
    case "active":
    case "running":
      return isDot
        ? "bg-green-500"
        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "inactive":
      return isDot
        ? "bg-gray-500"
        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    case "failed":
      return isDot
        ? "bg-red-500"
        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "activating":
    case "reloading":
      return isDot
        ? "bg-yellow-500"
        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    default:
      return isDot
        ? "bg-blue-500"
        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  }
}
