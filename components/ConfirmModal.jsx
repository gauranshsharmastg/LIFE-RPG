"use client";

import Modal from "./Modal";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="mb-6 text-sm leading-relaxed text-zinc-400">{message}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-[#2a2a2a] py-2.5 text-sm font-medium text-zinc-300 hover:bg-[#141414]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition active:scale-[0.98] ${
            danger
              ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/40 hover:bg-red-500/30"
              : "bg-[#39ff14] text-black hover:bg-[#2dd40f] shadow-[0_0_16px_rgba(57,255,20,0.35)]"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
