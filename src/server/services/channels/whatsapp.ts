// src/server/services/channels/whatsapp.ts
// No per-user OAuth — messages send from YOUR WhatsApp Business phone
// number. "Connecting" WhatsApp for a user really means: they provide a
// list of opted-in recipient numbers, and broadcasts go out as approved
// message templates (free-form text isn't allowed outside a 24h reply
// window). Template names/content must be pre-approved in Meta Business
// Manager before this will send.
export async function sendWhatsappTemplate(
  toPhoneNumber: string,
  templateName: string,
  languageCode: string,
  bodyParams: string[]
) {
  const res = await fetch(
    `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_BUSINESS_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: toPhoneNumber,
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
          components: [
            { type: "body", parameters: bodyParams.map((text) => ({ type: "text", text })) },
          ],
        },
      }),
    }
  );
  if (!res.ok) throw new Error(`WhatsApp send failed: ${await res.text()}`);
  return res.json();
}