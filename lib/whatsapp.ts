/**
 * WhatsApp Business API helper.
 * Set WHATSAPP_PHONE_ID and WHATSAPP_ACCESS_TOKEN in .env.local.
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
 */

const PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const BASE = "https://graph.facebook.com/v18.0";

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 && digits.startsWith("9") ? `91${digits}` : digits;
}

export async function sendWhatsAppText(to: string, text: string): Promise<boolean> {
  if (!PHONE_ID || !ACCESS_TOKEN) {
    console.warn("WhatsApp API not configured. Set WHATSAPP_PHONE_ID and WHATSAPP_ACCESS_TOKEN.");
    return false;
  }
  try {
    const res = await fetch(`${BASE}/${PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: formatPhone(to),
        type: "text",
        text: { body: text },
      }),
    });
    const data = await res.json();
    if (data.error) {
      console.error("WhatsApp API error:", data.error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("WhatsApp send failed:", e);
    return false;
  }
}

export async function sendAppointmentReminder(
  phone: string,
  customerName: string,
  serviceName: string,
  dateTime: string,
  salonName: string = "Wellins Hair Salon"
): Promise<boolean> {
  const text = `Hi ${customerName}! Reminder: Your appointment for ${serviceName} is on ${dateTime}. See you at ${salonName}!`;
  return sendWhatsAppText(phone, text);
}
