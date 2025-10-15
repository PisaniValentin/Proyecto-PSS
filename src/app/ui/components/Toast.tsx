"use client";
import React from "react";

type ToastType = "success" | "error" | "info";
type ToastItem = { id: string; message: string; type: ToastType };

export function useToast(timeoutMs = 2500) {
    const [toasts, setToasts] = React.useState<ToastItem[]>([]);

    const show = React.useCallback((message: string, type: ToastType = "info") => {
        const id =
            typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : Math.random().toString(36).slice(2);
        const item = { id, message, type };
        setToasts((prev) => [...prev, item]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, timeoutMs);
    }, [timeoutMs]);

    const ToastPortal = React.useCallback(
        () => (
            <div className="fixed right-4 bottom-4 z-[60] space-y-2">
                {toasts.map((t) => {
                    const color =
                        t.type === "success"
                            ? "bg-emerald-600"
                            : t.type === "error"
                                ? "bg-red-600"
                                : "bg-slate-800";
                    return (
                        <div
                            key={t.id}
                            className={`${color} text-white rounded-lg px-4 py-3 shadow-lg transition-all`}
                            role="status"
                        >
                            {t.message}
                        </div>
                    );
                })}
            </div>
        ),
        [toasts]
    );

    return { show, ToastPortal };
}