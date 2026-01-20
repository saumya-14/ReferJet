import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface Recipient {
  id: string;
  name: string;
  email: string;
  company: string;
}

interface CampaignData {
  recipients: Recipient[];
  template: {
    subject: string;
    body: string;
  };
}

// Helper function to replace template variables
function processTemplate(template: string, recipient: Recipient): string {
  return template
    .replace(/{{name}}/g, recipient.name || "(name)")
    .replace(/{{company}}/g, recipient.company || "(company)");
}

// Convert plain text to HTML (preserving line breaks)
function textToHtml(text: string): string {
  return text
    .split('\n')
    .map(line => line.trim() ? `<p>${line}</p>` : '<br>')
    .join('');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipients, template }: CampaignData = body;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is not configured" },
        { status: 500 }
      );
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: "No recipients provided" },
        { status: 400 }
      );
    }

    if (!template || !template.subject || !template.body) {
      return NextResponse.json(
        { error: "Template subject and body are required" },
        { status: 400 }
      );
    }

    // process.env.RESEND_FROM_EMAIL !;
    const fromEmail ="onboarding@resend.dev"
    const results = [];

    // Send emails to each recipient
    for (const recipient of recipients) {
      try {
        // Validate email format
        if (!recipient.email || !recipient.email.includes('@')) {
          results.push({
            recipientId: recipient.id,
            email: recipient.email,
            status: "failed",
            error: "Invalid email address",
          });
          continue;
        }

        // Process template with recipient data
        const processedSubject = processTemplate(template.subject, recipient);
        const processedBody = processTemplate(template.body, recipient);
        const htmlBody = textToHtml(processedBody);

        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: recipient.email,
          subject: processedSubject,
          html: htmlBody,
        });

        if (error) {
          results.push({
            recipientId: recipient.id,
            email: recipient.email,
            status: "failed",
            error: error.message,
          });
        } else {
          results.push({
            recipientId: recipient.id,
            email: recipient.email,
            status: "sent",
            messageId: data?.id,
          });
        }
      } catch (error: any) {
        results.push({
          recipientId: recipient.id,
          email: recipient.email,
          status: "failed",
          error: error.message,
        });
      }
    }

    const successCount = results.filter(r => r.status === "sent").length;
    const failedCount = results.filter(r => r.status === "failed").length;

    return NextResponse.json({
      success: true,
      total: recipients.length,
      sent: successCount,
      failed: failedCount,
      results: results,
    });
  } catch (error: any) {
    console.error("Campaign sending error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
