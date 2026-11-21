"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

/* Paper = 50mm x 70mm. The sheet fills the paper edge to edge (no side gap)
   and is 0.5mm shorter so it can never spill onto a 2nd page. */
const PAPER_W = "50mm";
const PAPER_H = "70mm";
const SHEET_W = "50mm";
const SHEET_H = "69.5mm";

/* Payment completed => payment receipt, otherwise a booking receipt. */
export function isReceiptPaid(receipt: ReceiptPayload) {
  const ps = (receipt.paymentStatus || "").toLowerCase();
  if (["paid", "completed", "succeeded", "success"].includes(ps)) return true;
  return receipt.type === "transaction" && !ps;
}

function ReceiptSheet({
  receipt,
  formattedDate,
  shortJobId,
  cardDisplay,
}: {
  receipt: ReceiptPayload;
  formattedDate: string;
  shortJobId: string;
  cardDisplay: string;
}) {
  const isPaid = isReceiptPaid(receipt);

  const sheetRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // If a receipt has lots of fields, shrink it slightly so it always fits
  // on one page (preview and print use the same logic, so they match).
  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (!sheet || !top || !bottom || sheet.clientHeight === 0) return;
    const cs = getComputedStyle(sheet);
    const avail =
      sheet.clientHeight -
      parseFloat(cs.paddingTop) -
      parseFloat(cs.paddingBottom);
    const natural = top.offsetHeight + bottom.offsetHeight + 2;
    setScale(natural > avail ? Math.max(0.65, avail / natural) : 1);
  }, [receipt]);

  return (
    <div
      ref={sheetRef}
      className="bg-white text-black font-mono box-border"
      style={{
        width: SHEET_W,
        height: SHEET_H,
        overflow: "hidden",
        padding: "6px 5px",
        fontSize: "9px",
        lineHeight: "1.35",
        color: "#000000",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div ref={topRef}>
          <div className="text-center border-b border-dashed border-black pb-1.5 mb-1.5">
            <p className="font-bold text-[11px] tracking-tight text-black">
              FIXLAB
            </p>
            {/* full-width black bar, white text */}
            <div
              className="font-bold text-white text-[8px]"
              style={{
                backgroundColor: "#000",
                color: "#fff",
                margin: `3px ${-5 / scale}px 0`,
                padding: "2px 0",
                letterSpacing: "0.18em",
              }}
            >
              {isPaid ? "PAYMENT RECEIPT" : "BOOKING RECEIPT"}
            </div>
            <p className="text-[7.5px] mt-1 text-black">{formattedDate}</p>
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

          {isPaid && (
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

        <div ref={bottomRef} className="text-black">
          <div className="flex items-center justify-between font-bold text-[10.5px] pt-1 border-t border-dashed border-black">
            <span>{isPaid ? "PAID:" : "PAYMENT:"}</span>
            <span>${receipt.amount}</span>
          </div>
          <p className="text-center text-[7.5px] mt-1.5">
            Thank you for choosing FixLab
          </p>
        </div>
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

  const isPaid = isReceiptPaid(receipt);
  const sheetKey = `${receipt.bookingId}-${receipt.transactionId || ""}-${receipt.type}`;

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
    : isPaid
    ? "CARD PAYMENT"
    : "PENDING PAYMENT";

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style jsx global>{`
        /* On screen the print copy stays laid out (so it measures exactly like
           the preview) but is invisible and parked off-screen. */
        .paperang-print-root {
          display: block;
          position: fixed;
          left: -10000px;
          top: 0;
          width: ${PAPER_W};
          height: ${PAPER_H};
          overflow: hidden;
          visibility: hidden;
          pointer-events: none;
        }

        @media print {
          /* paper: 50mm x 70mm, no page margin */
          @page {
            size: ${PAPER_W} ${PAPER_H};
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: ${PAPER_W} !important;
            height: ${PAPER_H} !important;
            min-height: 0 !important;
            max-height: ${PAPER_H} !important;
            overflow: hidden !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body > *:not(.paperang-print-root) {
            display: none !important;
          }

          .paperang-print-root {
            display: block !important;
            visibility: visible !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: ${PAPER_W} !important;
            height: ${PAPER_H} !important;
            overflow: hidden !important;
            background: #ffffff !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          .paperang-print-root,
          .paperang-print-root * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
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
                  {isPaid ? "Transaction Receipt" : "Booking Receipt"}
                </h3>
                <p className="text-[11px] font-semibold text-gray-500">
                  Paperang P1 • 50mm × 70mm
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

            {/* Preview = exactly what prints (same component, same mm size) */}
            <div className="flex justify-center py-3">
              <div
                style={{
                  width: SHEET_W,
                  height: SHEET_H,
                  boxShadow: "0 0 0 1px #cbd5e1, 0 6px 16px rgba(15,23,42,0.12)",
                }}
              >
                <ReceiptSheet
                  key={sheetKey}
                  receipt={receipt}
                  formattedDate={formattedDate}
                  shortJobId={shortJobId}
                  cardDisplay={cardDisplay}
                />
              </div>
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
                <span>Print 50×70mm</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {createPortal(
        <div className="paperang-print-root">
          <ReceiptSheet
            key={sheetKey}
            receipt={receipt}
            formattedDate={formattedDate}
            shortJobId={shortJobId}
            cardDisplay={cardDisplay}
          />
        </div>,
        document.body
      )}
    </>
  );
}