import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

export type ToastVariant = "info" | "success" | "warning" | "alert";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
  durationMs?: number; // default 5000
}

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const slideOut = keyframes`
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(24px); }
`;

const ToastContainer = styled.div<{ $variant: ToastVariant; $leaving: boolean }>`
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: ${(p) => p.theme?.radii?.md ?? "8px"};
  box-shadow: ${(p) => p.theme?.shadows?.md ?? "0 4px 6px -1px rgb(0 0 0 / 0.1)"};
  background-color: ${({ $variant, theme }) => {
    const t = theme?.colors;
    switch ($variant) {
      case "success": return t?.success ?? "#10b981";
      case "warning": return t?.warning ?? "#f59e0b";
      case "alert":   return t?.danger  ?? "#ef4444";
      case "info":
      default:        return t?.info    ?? "#3b82f6";
    }
  }};
  color: ${(p) => p.theme?.colors?.text?.inverse ?? "#fff"};
  animation: ${({ $leaving }) => ($leaving ? slideOut : slideIn)} 200ms ease forwards;
  will-change: transform, opacity;
`;

const ToastText = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme?.typography?.body?.medium?.fontSize ?? "1rem"};
  line-height: ${(p) => p.theme?.typography?.body?.medium?.lineHeight ?? "1.5"};
  font-weight: 500;
`;

const IconWrap = styled.div`
  display: grid;
  place-items: center;
`;

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = "info",
  onClose,
  durationMs = 5000,
}) => {
  const [leaving, setLeaving] = React.useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onClose?.(), 200);
    }, durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onClose]);

  const iconProps = { size: 18, color: "#fff" };
  const Icon = (() => {
    switch (variant) {
      case "success": return CheckCircle2;
      case "warning": return AlertTriangle;
      case "alert":   return AlertCircle;
      case "info":
      default:        return Info;
    }
  })();

  return (
    <ToastContainer $variant={variant} $leaving={leaving} className="text-base font-medium">
      <IconWrap>
        <Icon {...iconProps} />
      </IconWrap>
      <ToastText>{message}</ToastText>
    </ToastContainer>
  );
};

export default Toast;