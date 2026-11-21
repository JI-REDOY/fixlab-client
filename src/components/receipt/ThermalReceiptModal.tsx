"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Printer, X } from "lucide-react";

export interface ReceiptPayload {
  type: "booking" | "transaction";
  bookingId: string;
  transactionId?: string;
  serviceTitle?: string;
  status?: string;
  paymentStatus?: string;
  amount: number | string;
  currency?: string;
  technicianName?: string;
  technicianEmail?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  preferredDate?: string;
  paidAt?: string;
  cardBrand?: string;
  cardLast4?: string;
}

function ReceiptSheet({
  receipt,
  formattedDate,
  shortJobId,
  cardDisplay,
  variant = "preview",
}: {
  receipt: ReceiptPayload;
  formattedDate: string;
  shortJobId: string;
  cardDisplay: string;
  variant?: "preview" | "print";
}) {
  const isPrint = variant === "print";

  return (
    <div
      className={
        isPrint
          ? "paperang-exact-sheet bg-white text-black font-mono box-border"
          : "w-[189px] min-h-[272px] bg-white text-black border border-dashed border-slate-400 p-2.5 font-mono text-[9px] leading-[1.35] flex flex-col justify-between box-border"
      }
      style={
        isPrint
          ? {
              width: "189px",
              minHeight: "272px",
              padding: "8px 4px",
              fontSize: "9px",
              lineHeight: "1.35",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: "#000000",
              backgroundColor: "#ffffff",
            }
          : undefined
      }
    >
      <div>
        <div className="text-center border-b border-dashed border-black pb-1.5 mb-1.5">
          <p className="font-bold text-[11px] tracking-tight text-black">
            FIXLAB
          </p>
          <p className="text-[8px] text-black">
            {receipt.type === "transaction"
              ? "PAYMENT RECEIPT"
              : "BOOKING RECEIPT"}
          </p>
          <p className="text-[7.5px] mt-0.5 text-black">{formattedDate}</p>
        </div>

        <div className="space-y-0.5 border-b border-dashed border-black pb-1.5 mb-1.5 text-black">
          <div className="flex justify-between gap-1">
            <span>JOB:</span>
            <span className="font-bold">{shortJobId}</span>
          </div>
          {receipt.transactionId && (
            <div className="flex justify-between gap-1">
              <span>TXN:</span>
              <span className="font-bold break-all text-right">
                {receipt.transactionId}
              </span>
            </div>
          )}
          <div className="flex justify-between gap-1">
            <span>SRV:</span>
            <span className="font-bold text-right break-words max-w-[125px]">
              {receipt.serviceTitle || "Repair Service"}
            </span>
          </div>
          <div className="flex justify-between gap-1">
            <span>TECH:</span>
            <span className="font-bold text-right break-words max-w-[120px]">
              {receipt.technicianName || "Verified Tech"}
            </span>
          </div>
          {receipt.technicianEmail && (
            <div className="break-all text-[7.5px]">
              T-MAIL: {receipt.technicianEmail}
            </div>
          )}
        </div>

        <div className="space-y-0.5 border-b border-dashed border-black pb-1.5 mb-1.5 text-[8px] text-black">
          <div className="font-bold break-words">
            CUST: {receipt.customerName || "Customer"}
          </div>
          {receipt.customerEmail && (
            <div className="break-all">EMAIL: {receipt.customerEmail}</div>
          )}
          {receipt.customerPhone && (
            <div className="break-words">PH: {receipt.customerPhone}</div>
          )}
          {receipt.address && (
            <div className="break-words">ADDR: {receipt.address}</div>
          )}
        </div>

        {receipt.type === "transaction" && (
          <div className="space-y-0.5 border-b border-dashed border-black pb-1.5 mb-1.5 text-[8px] text-black">
            <div className="flex justify-between gap-1">
              <span>CARD:</span>
              <span className="font-bold">{cardDisplay}</span>
            </div>
            <div className="flex justify-between gap-1">
              <span>CURR:</span>
              <span className="uppercase">{receipt.currency || "usd"}</span>
            </div>
            <div className="flex justify-between gap-1">
              <span>PAY:</span>
              <span className="uppercase font-bold">
                {receipt.paymentStatus || "paid"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="text-black">
        <div className="flex items-center justify-between font-bold text-[10.5px] pt-1 border-t border-dashed border-black">
          <span>{receipt.type === "transaction" ? "PAID:" : "PAYMENT:"}</span>
          <span>${receipt.amount}</span>
        </div>
        <p className="text-center text-[7.5px] mt-1.5">
          Thank you for choosing FixLab
        </p>
      </div>
    </div>
  );
}

export default function ThermalReceiptModal({
  receipt,
  onClose,
}: {
  receipt: ReceiptPayload | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!receipt) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [receipt, onClose]);

  if (!receipt || typeof document === "undefined") return null;

  const shortJobId = receipt.bookingId
    ? `#${receipt.bookingId.slice(-6).toUpperCase()}`
    : "—";

  const formattedDate = receipt.paidAt
    ? new Date(receipt.paidAt).toLocaleString()
    : receipt.preferredDate
    ? new Date(receipt.preferredDate).toLocaleDateString()
    : new Date().toLocaleString();

  const cardDisplay = receipt.cardLast4
    ? `${(receipt.cardBrand || "CARD").toUpperCase()} •••• ${receipt.cardLast4}`
    : receipt.type === "transaction"
    ? "CARD PAYMENT"
    : "PENDING PAYMENT";

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style jsx global>{`
        .paperang-print-root {
          display: none;
        }

        @media print {
          @page {
            size: 50mm 72mm;
            margin: 1mm;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body > *:not(.paperang-print-root) {
            display: none !important;
          }

          .paperang-print-root {
            display: block !important;
            position: static !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          .paperang-exact-sheet {
            width: 48mm !important;
            min-height: 70mm !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {createPortal(
        <div
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[2rem] bg-white border border-slate-200 ring-1 ring-slate-900/15 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.35)]"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  {receipt.type === "transaction"
                    ? "Transaction Receipt"
                    : "Booking Receipt"}
                </h3>
                <p className="text-[11px] font-semibold text-gray-500">
                  Paperang P1 • 50mm × 72mm
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close receipt"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-700 flex items-center justify-center cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex justify-center py-2">
              <ReceiptSheet
                receipt={receipt}
                formattedDate={formattedDate}
                shortJobId={shortJobId}
                cardDisplay={cardDisplay}
                variant="preview"
              />
            </div>

            <div className="flex gap-2.5 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-800 text-xs font-extrabold cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#ff5722] to-[#ff6d3f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs font-extrabold shadow-[6px_6px_15px_rgba(255,87,34,0.34)] inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer size={14} />
                <span>Print 50×72mm</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {createPortal(
        <div className="paperang-print-root">
          <ReceiptSheet
            receipt={receipt}
            formattedDate={formattedDate}
            shortJobId={shortJobId}
            cardDisplay={cardDisplay}
            variant="print"
          />
        </div>,
        document.body
      )}
    </>
  );
}