import { PermissionStatus } from "@/src/constants";

export type PermissionKey = "notifications" | "accessibility";
export type PermissionStates = Record<PermissionKey, PermissionStatus>;
