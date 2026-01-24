import { PermissionStatus } from "@/src/constants";

export type PermissionKey = "notifications" | "usage";
export type PermissionStates = Record<PermissionKey, PermissionStatus>;
