import { ReceiptPayload } from "./ThermalReceiptModal";

export function bookingToReceipt(booking: any): ReceiptPayload {
  const amount = booking?.finalAmount ?? booking?.basePrice ?? 0;
  return {
    type: "booking",
    bookingId: booking?._id || "",
    serviceTitle: booking?.serviceTitle || "Repair Service",
    status: booking?.status || "accepted",
    paymentStatus: booking?.paymentStatus || "unpaid",
    amount,
    currency: "usd",
    technicianName: booking?.technicianName || "Verified Tech",
    technicianEmail: booking?.technicianEmail || "",
    customerName: booking?.customerName || "Customer",
    customerEmail: booking?.customerEmail || "",
    customerPhone: booking?.customerPhone || "",
    address: booking?.address || "",
    preferredDate: booking?.preferredDate || "",
  };
}

export function transactionToReceipt(
  payment: any,
  booking?: any
): ReceiptPayload {
  const amount =
    payment?.amount ?? booking?.finalAmount ?? booking?.basePrice ?? 0;
  return {
    type: "transaction",
    bookingId: payment?.bookingId || booking?._id || "",
    transactionId:
      payment?.transactionId || payment?.stripePaymentIntentId || "",
    serviceTitle:
      payment?.serviceTitle || booking?.serviceTitle || "Repair Service",
    status: booking?.status || "completed",
    paymentStatus: payment?.paymentStatus || "paid",
    amount,
    currency: payment?.currency || "usd",
    technicianName:
      payment?.technicianName || booking?.technicianName || "Verified Tech",
    technicianEmail:
      payment?.technicianEmail || booking?.technicianEmail || "",
    customerName:
      payment?.customerName || booking?.customerName || "Customer",
    customerEmail:
      payment?.customerEmail || booking?.customerEmail || "",
    customerPhone: booking?.customerPhone || "",
    address: booking?.address || "",
    paidAt: payment?.paidAt || payment?.createdAt || "",
    cardBrand: payment?.cardBrand || payment?.paymentMethodBrand || "",
    cardLast4: payment?.cardLast4 || payment?.last4 || "",
  };
}