import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, score, grade, recommendation, selectedAnswers } = await req.json();

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const adminEmail = process.env.SMTP_ADMIN_EMAIL || "555jinson@gmail.com";

    // Detailed Plain Text summary of answers
    const answersText = `
1. Mobile Speed: ${selectedAnswers[1]} / 10 pts
2. Responsiveness: ${selectedAnswers[2]} / 10 pts
3. Conversion CTA: ${selectedAnswers[3]} / 10 pts
4. Google SEO: ${selectedAnswers[4]} / 10 pts
5. Analytics Tracker: ${selectedAnswers[5]} / 10 pts
6. Update Frequency: ${selectedAnswers[6]} / 10 pts
7. Security Protocol: ${selectedAnswers[7]} / 10 pts
8. Stack Platform: ${selectedAnswers[8]} / 10 pts
9. Lead Captures: ${selectedAnswers[9]} / 10 pts
10. UI Aesthetics: ${selectedAnswers[10]} / 10 pts
    `.trim();

    // Check if SMTP is configured
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || "465"),
        secure: parseInt(smtpPort || "465") === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // 1. Send detailed lead report to Admin (Antony)
      await transporter.sendMail({
        from: `"${smtpUser.split("@")[0].toUpperCase()} AUDITS" <${smtpUser}>`,
        to: adminEmail,
        subject: `🔥 New AI Website Assessment Lead: ${score}/100 [Grade ${grade}]`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
            <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-top: 0;">New AI Website Audit Lead</h2>
            <p style="font-size: 16px; color: #374151;">You have received a new website self-assessment submission.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Lead Email:</strong> <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></p>
              <p style="margin: 5px 0;"><strong>Calculated Score:</strong> <span style="font-size: 18px; color: #10b981; font-weight: bold;">${score}/100</span></p>
              <p style="margin: 5px 0;"><strong>Diagnostic Grade:</strong> <span style="font-weight: bold;">Grade ${grade}</span></p>
              <p style="margin: 5px 0;"><strong>Recommendation:</strong> ${recommendation}</p>
            </div>
            <h3 style="color: #4b5563; margin-top: 25px;">Detailed Questionnaire Answers:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #e5e7eb; text-align: left;">
                  <th style="padding: 10px; border: 1px solid #d1d5db;">Metric</th>
                  <th style="padding: 10px; border: 1px solid #d1d5db; width: 80px;">Points</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style="padding: 10px; border: 1px solid #d1d5db;">Mobile Load Speed</td><td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">${selectedAnswers[1]}/10</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #d1d5db;">Responsiveness & Scaling</td><td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">${selectedAnswers[2]}/10</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #d1d5db;">CTA Conversion Setup</td><td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">${selectedAnswers[3]}/10</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #d1d5db;">First Page Google SEO</td><td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">${selectedAnswers[4]}/10</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #d1d5db;">User Analytics Tracking</td><td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">${selectedAnswers[5]}/10</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #d1d5db;">Content Update Frequency</td><td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">${selectedAnswers[6]}/10</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #d1d5db;">SSL & Modern Security</td><td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">${selectedAnswers[7]}/10</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #d1d5db;">Framework Modernity</td><td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">${selectedAnswers[8]}/10</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #d1d5db;">Auto Lead Capture Bookings</td><td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">${selectedAnswers[9]}/10</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #d1d5db;">3D Motion Aesthetics</td><td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">${selectedAnswers[10]}/10</td></tr>
              </tbody>
            </table>
            <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 15px;">
              AI Assessment Engine © ${new Date().getFullYear()} Antony Francis.
            </div>
          </div>
        `,
      });

      // 2. Send customized receipt report to the Client
      await transporter.sendMail({
        from: `"Antony Francis" <${smtpUser}>`,
        to: email,
        subject: `Your Website Audit Scorecard Report is Ready! [Score: ${score}/100]`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #fafaf9; color: #1c1917;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #44443a; font-size: 26px; margin: 0; font-weight: bold; letter-spacing: -0.5px;">Antony Francis</h1>
              <p style="color: #78716c; font-size: 14px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">React & Next.js Developer</p>
            </div>
            <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; border: 1px solid #e7e5e4; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
              <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #292524; text-align: center;">Diagnostic Audit Scorecard</h2>
              
              <div style="text-align: center; margin: 25px 0;">
                <div style="display: inline-block; width: 120px; height: 120px; line-height: 120px; border-radius: 50%; background-color: #f0fdf4; border: 4px solid #10b981; font-size: 32px; font-weight: bold; color: #047857;">
                  ${score}%
                </div>
                <p style="font-size: 16px; font-weight: bold; color: #065f46; margin: 10px 0 0 0;">Rating Grade: ${grade}</p>
              </div>

              <div style="border-top: 1px solid #f5f5f4; border-bottom: 1px solid #f5f5f4; padding: 15px 0; margin: 20px 0;">
                <h4 style="margin: 0 0 8px 0; color: #44443a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Our Diagnostic Evaluation:</h4>
                <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #44403c;">${recommendation}</p>
              </div>

              <h4 style="margin: 0 0 12px 0; color: #44443a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Detailed Metric Analysis:</h4>
              <ul style="margin: 0; padding: 0 0 0 20px; font-size: 14px; color: #57534e; line-height: 1.6;">
                <li>Mobile Performance: <strong>${selectedAnswers[1]}/10 pts</strong></li>
                <li>Device Scalability & Grid Responsiveness: <strong>${selectedAnswers[2]}/10 pts</strong></li>
                <li>Above-the-Fold CTA Optimization: <strong>${selectedAnswers[3]}/10 pts</strong></li>
                <li>Google Page-1 Crawling SEO Rank: <strong>${selectedAnswers[4]}/10 pts</strong></li>
                <li>Dynamic Visitor Analytics Hooks: <strong>${selectedAnswers[5]}/10 pts</strong></li>
                <li>CMS Update Iterations: <strong>${selectedAnswers[6]}/10 pts</strong></li>
                <li>Security Encryptions & Layers: <strong>${selectedAnswers[7]}/10 pts</strong></li>
                <li>Modern Tech-Stack Architecture: <strong>${selectedAnswers[8]}/10 pts</strong></li>
                <li>Pre-fill Scheduling Form Intakes: <strong>${selectedAnswers[9]}/10 pts</strong></li>
                <li>3D Transitions & Immersive UI: <strong>${selectedAnswers[10]}/10 pts</strong></li>
              </ul>
            </div>

            <div style="background-color: #44443a; border-radius: 8px; padding: 20px; color: #ffffff; text-align: center; margin-top: 25px;">
              <h3 style="margin: 0 0 10px 0; font-size: 18px;">Claim Your Free Website Strategy Session!</h3>
              <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.4; color: #e7e5e4;">Let's map out a pixel-perfect, hyper-performing conversion layout to plug your traffic leaks.</p>
              <a href="https://antony-nine.vercel.app/#contact" style="display: inline-block; background-color: #ffffff; color: #44443a; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; font-size: 14px; transition: background-color 0.2s;">
                Book Strategy Call
              </a>
            </div>

            <p style="text-align: center; font-size: 11px; color: #a8a29e; margin-top: 30px;">
              You received this email because you requested a website assessment scorecard on antonyfrancis.in.
            </p>
          </div>
        `,
      });

      return NextResponse.json({ success: true, method: "smtp" });
    } else {
      // SMTP is not configured, return a status instructing the client to submit
      // directly to Web3Forms from the browser to avoid server IP restrictions.
      console.warn("[Mailer Warning] SMTP is not configured. Returning client fallback requirement status.");
      return NextResponse.json({ success: true, method: "client_fallback_required" });
    }
  } catch (error: any) {
    console.error("Scorecard submission handler error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process scorecard." },
      { status: 500 }
    );
  }
}
