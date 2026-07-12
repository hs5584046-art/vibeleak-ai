import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  PRODUCT,
  buildUpiUri,
  calculateDiscount,
  createOpaqueToken,
  encryptToken,
  formatInr,
  hashToken,
  normalizeCoupon
} from "@/lib/payments";
import { env } from "@/lib/env";
import { escapeHtml, sendEmail } from "@/lib/email";

const requestSchema = z.object({
  mode: z.enum(["quote", "submit"]),
  sessionId: z.uuid(),
  sessionToken: z.string().min(20),
  couponCode: z.string().max(40).optional(),
  customerName: z.string().trim().min(2).max(100).optional(),
  customerEmail: z.email().optional(),
  utr: z.string().trim().min(6).max(80).regex(/^[A-Za-z0-9-]+$/).optional()
});

async function validateSession(sessionId: string, token: string) {
  const database = createAdminClient();
  const { data } = await database
    .from("assessment_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("access_token_hash", hashToken(token))
    .maybeSingle();
  return Boolean(data);
}

async function couponQuote(code: string) {
  if (!code) return { code: null, discountPaise: 0 };
  const database = createAdminClient();
  const now = new Date().toISOString();
  const { data } = await database
    .from("coupons")
    .select("code,discount_type,discount_value,max_redemptions,redemption_count,starts_at,expires_at")
    .eq("code", code)
    .eq("active", true)
    .maybeSingle();

  const valid = data
    && (!data.starts_at || data.starts_at <= now)
    && (!data.expires_at || data.expires_at >= now)
    && (data.max_redemptions === null || data.redemption_count < data.max_redemptions);

  if (!valid) return { code: null, discountPaise: 0 };
  return {
    code: data.code,
    discountPaise: calculateDiscount(
      PRODUCT.amountPaise,
      data.discount_type as "percent" | "fixed",
      data.discount_value
    )
  };
}

export async function POST(request: NextRequest) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payment request." }, { status: 400 });

  const input = parsed.data;
  if (!await validateSession(input.sessionId, input.sessionToken)) {
    return NextResponse.json({ error: "Assessment session expired or invalid." }, { status: 403 });
  }

  const coupon = await couponQuote(normalizeCoupon(input.couponCode));
  const finalAmountPaise = PRODUCT.amountPaise - coupon.discountPaise;

  if (input.mode === "quote") {
    return NextResponse.json({
      product: PRODUCT.title,
      amountPaise: PRODUCT.amountPaise,
      discountPaise: coupon.discountPaise,
      finalAmountPaise,
      amountLabel: formatInr(PRODUCT.amountPaise),
      finalAmountLabel: formatInr(finalAmountPaise),
      couponCode: coupon.code,
      upiUri: buildUpiUri(finalAmountPaise, input.sessionId)
    });
  }

  if (!input.customerName || !input.customerEmail || !input.utr) {
    return NextResponse.json({ error: "Name, email and UTR are required." }, { status: 400 });
  }

  const auth = await createClient();
  const { data: claims } = await auth.auth.getClaims();
  const statusToken = createOpaqueToken();
  const database = createAdminClient();

  const { data: payment, error } = await database
    .from("payment_requests")
    .insert({
      session_id: input.sessionId,
      user_id: claims?.claims?.sub ?? null,
      product_id: PRODUCT.id,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      utr: input.utr,
      amount_paise: PRODUCT.amountPaise,
      discount_paise: coupon.discountPaise,
      final_amount_paise: finalAmountPaise,
      currency: PRODUCT.currency,
      coupon_code: coupon.code,
      status_token_hash: hashToken(statusToken),
      status_token_ciphertext: encryptToken(statusToken)
    })
    .select("id")
    .single();

  if (error?.code === "23505") {
    return NextResponse.json({ error: "This UTR has already been submitted." }, { status: 409 });
  }
  if (error) return NextResponse.json({ error: "Payment request could not be created." }, { status: 500 });


  const statusUrl = `${env.NEXT_PUBLIC_APP_URL}/assessments/personality-dna?payment=${payment.id}&token=${encodeURIComponent(statusToken)}`;

  await Promise.allSettled([
    sendEmail({
      to: env.PAYMENT_NOTIFICATION_EMAIL,
      subject: `New payment verification — ${input.customerName}`,
      html: `<h2>New VibeLytix payment</h2><p><b>Name:</b> ${escapeHtml(input.customerName)}</p><p><b>Email:</b> ${escapeHtml(input.customerEmail)}</p><p><b>UTR:</b> ${escapeHtml(input.utr)}</p><p><b>Amount:</b> ${escapeHtml(formatInr(finalAmountPaise))}</p><p>Review it in the admin dashboard.</p>`
    }),
    sendEmail({
      to: input.customerEmail,
      subject: "Your VibeLytix payment is being verified",
      html: `<h2>Payment submitted</h2><p>We received your transaction reference and will verify it.</p><p><a href="${escapeHtml(statusUrl)}">Open your secure report status page</a></p><p>Keep this email until your report unlocks.</p>`
    })
  ]);

  return NextResponse.json({
    paymentId: payment.id,
    statusToken,
    status: "pending",
    finalAmountLabel: formatInr(finalAmountPaise)
  }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const token = request.nextUrl.searchParams.get("token");
  if (!id || !token || !z.uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Invalid status request." }, { status: 400 });
  }

  const database = createAdminClient();
  const { data } = await database
    .from("payment_requests")
    .select("status,rejection_reason,session_id")
    .eq("id", id)
    .eq("status_token_hash", hashToken(token))
    .maybeSingle();

  if (!data) return NextResponse.json({ error: "Payment request not found." }, { status: 404 });

  return NextResponse.json({
    status: data.status,
    rejectionReason: data.rejection_reason,
    sessionId: data.status === "approved" ? data.session_id : undefined
  }, { headers: { "Cache-Control": "no-store" } });
}
