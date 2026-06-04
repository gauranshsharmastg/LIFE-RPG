"use client";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="animate-slide-up relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[#39ff14]/30 bg-[#0a0a0a] p-5 shadow-[0_0_40px_rgba(57,255,20,0.15)] sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="modal-title" className="text-lg font-bold text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#2a2a2a] px-2 py-1 text-sm text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
