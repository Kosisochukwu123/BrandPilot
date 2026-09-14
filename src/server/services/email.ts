import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await resend.emails.send({
    from: "BrandPilot <onboarding@resend.dev>",
    to,
    subject: "Reset your BrandPilot password",
    html: `
      <p>Someone requested a password reset for your BrandPilot account.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a> — this link expires in 1 hour.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}
