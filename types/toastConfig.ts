import { ReactNode } from "react";

export type ToastType = "success" | "error" | "warning" | "information";

export interface ToastConfig {
  text: string;
  icon: string | ReactNode;
  borderColor: string;
  textColor: string;
  bgColor: string;
}