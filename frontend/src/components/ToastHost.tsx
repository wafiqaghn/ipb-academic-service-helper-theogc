import { useToastStore } from "@/store/toastStore";
import { AnimatePresence, motion } from "framer-motion";

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-md flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="pointer-events-auto rounded-xl border border-slate-200 bg-white p-4 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.title}</div>
                  {t.description ? <div className="mt-1 text-xs text-slate-600">{t.description}</div> : null}
                </div>
                <button type="button" className="text-xs text-slate-500" onClick={() => dismiss(t.id)}>
                  Tutup
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
