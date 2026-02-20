import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import type { ContactFormData, ContactResponse } from "@/types/contact";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FALLBACK_EMAIL = "delivered@resend.dev";

function validateFields(
  body: ContactFormData,
): string | null {
  if (!body.name?.trim()) return "Name is required.";
  if (!body.email?.trim()) return "Email is required.";
  if (!EMAIL_REGEX.test(body.email)) return "Invalid email format.";
  if (!body.message?.trim()) return "Message is required.";
  return null;
}

export async function POST(
  request: Request,
): Promise<NextResponse<ContactResponse>> {
  try {
    const body = (await request.json()) as ContactFormData;

    const validationError = validateFields(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 },
      );
    }

    const to = process.env.CONTACT_EMAIL ?? FALLBACK_EMAIL;

    await getResend().emails.send({
      from: "Solution0ne <onboarding@resend.dev>",
      to,
      subject: `New Contact: ${body.name.trim()}`,
      html: [
        "<h2>New Contact Form Submission</h2>",
        `<p><strong>Name:</strong> ${body.name.trim()}</p>`,
        `<p><strong>Email:</strong> ${body.email.trim()}</p>`,
        `<p><strong>Message:</strong></p>`,
        `<p>${body.message.trim()}</p>`,
      ].join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send message.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
