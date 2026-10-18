import { NextRequest, NextResponse } from "next/server";
import { sendWeb3FormsEmail, getAuthorizedOwnerEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const ownerEmail = getAuthorizedOwnerEmail();
    const subject = `New Portfolio Contact Inquiry from ${name}`;
    const formattedMessage = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n— SAIL.06 Web Contact System`;

    const delivered = await sendWeb3FormsEmail({
      toEmail: ownerEmail,
      subject,
      message: formattedMessage,
    });

    if (delivered) {
      return NextResponse.json({
        success: true,
        message: "Message sent successfully!",
      });
    }

    return NextResponse.json(
      { error: "Could not send message via email delivery service." },
      { status: 502 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your message." },
      { status: 500 }
    );
  }
}
