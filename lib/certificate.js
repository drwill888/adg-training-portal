// lib/certificate.js
// Generates a downloadable completion certificate for the 5C Leadership Blueprint

export async function downloadCertificate(userName, completionDate) {
  var dateStr = completionDate || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  var name = userName || "Leader";

  // Fetch logo as base64 data URI from server-side API route
  var logoDataUri = '';
  try {
    var logoRes = await fetch('/api/logo-base64');
    if (logoRes.ok) {
      logoDataUri = await logoRes.text();
    }
  } catch (e) {
    console.warn('Could not load ADG logo for certificate:', e);
  }

  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"/><style>';
  html += '@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap");';
  html += '@page { size: 11in 8.5in landscape; margin: 0; }';
  html += '* { box-sizing: border-box; margin: 0; padding: 0; }';
  html += 'html, body { width: 11in; height: 8.5in; background: #FDF8F0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  html += '.cert { width: 11in; height: 8.5in; position: relative; background: #FDF8F0; font-family: "Outfit", sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; overflow: hidden; }';
  html += '.border-outer { position: absolute; top: 22px; left: 22px; right: 22px; bottom: 22px; border: 2px solid #C8A951; }';
  html += '.border-inner { position: absolute; top: 30px; left: 30px; right: 30px; bottom: 30px; border: 1px solid rgba(200,169,81,0.45); }';
  html += '.corner { position: absolute; width: 44px; height: 44px; }';
  html += '.corner-tl { top: 38px; left: 38px; border-top: 2px solid #021A35; border-left: 2px solid #021A35; }';
  html += '.corner-tr { top: 38px; right: 38px; border-top: 2px solid #021A35; border-right: 2px solid #021A35; }';
  html += '.corner-bl { bottom: 38px; left: 38px; border-bottom: 2px solid #021A35; border-left: 2px solid #021A35; }';
  html += '.corner-br { bottom: 38px; right: 38px; border-bottom: 2px solid #021A35; border-right: 2px solid #021A35; }';
  html += '.content { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 50px 120px; z-index: 1; }';
  html += '.logo-area { margin-bottom: 18px; }';
  html += '.eyebrow { font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; font-weight: 600; color: #C8A951; margin-bottom: 10px; }';
  html += '.cert-title { font-family: "Cormorant Garamond", serif; font-size: 52px; font-weight: 600; color: #021A35; line-height: 1.1; margin-bottom: 4px; }';
  html += '.cert-subtitle { font-family: "Cormorant Garamond", serif; font-size: 15px; color: #6b7280; font-style: italic; margin-bottom: 18px; letter-spacing: 0.04em; }';
  html += '.gold-rule { width: 80px; height: 2px; background: #C8A951; margin: 0 auto 16px; }';
  html += '.presented { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.18em; margin-bottom: 6px; }';
  html += '.recipient { font-family: "Cormorant Garamond", serif; font-size: 46px; font-weight: 700; color: #021A35; line-height: 1.1; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid #C8A951; display: inline-block; }';
  html += '.completion-text { font-size: 12.5px; color: #444; line-height: 1.85; max-width: 580px; margin: 0 auto 18px; }';
  html += '.dimensions { display: flex; justify-content: center; gap: 8px; margin-bottom: 18px; }';
  html += '.dim { padding: 4px 14px; border-radius: 3px; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid #021A35; color: #021A35; background: transparent; }';
  html += '.date-line { font-size: 11px; color: #999; margin-bottom: 22px; letter-spacing: 0.08em; }';
  html += '.sig-block { text-align: center; min-width: 220px; }';
  html += '.sig-line { border-top: 1px solid #021A35; padding-top: 10px; margin-top: 30px; }';
  html += '.sig-name { font-size: 13px; font-weight: 700; color: #021A35; letter-spacing: 0.03em; }';
  html += '.sig-title { font-size: 10px; color: #888; margin-top: 3px; line-height: 1.6; }';
  html += '.footer-text { position: absolute; bottom: 36px; left: 0; right: 0; text-align: center; font-size: 9px; color: #bbb; letter-spacing: 0.08em; }';
  html += '</style></head><body>';

  html += '<div class="cert">';
  html += '<div class="border-outer"></div>';
  html += '<div class="border-inner"></div>';
  html += '<div class="corner corner-tl"></div>';
  html += '<div class="corner corner-tr"></div>';
  html += '<div class="corner corner-bl"></div>';
  html += '<div class="corner corner-br"></div>';
  html += '<div class="content">';

  // Logo — embedded as base64 data URI, no network dependency in print window
  html += '<div class="logo-area">';
  if (logoDataUri) {
    html += '<img src="' + logoDataUri + '" alt="Awakening Destiny Global" style="height:44px;width:auto;" />';
  }
  html += '</div>';

  html += '<p class="eyebrow">Certificate of Completion</p>';
  html += '<h1 class="cert-title">Called to Carry</h1>';
  html += '<p class="cert-subtitle">5C Leadership Blueprint</p>';
  html += '<div class="gold-rule"></div>';
  html += '<p class="presented">This certifies that</p>';
  html += '<h2 class="recipient">' + name + '</h2>';
  html += '<p class="completion-text">has successfully completed the Called to Carry 5C Leadership Blueprint — a formation-based leadership development experience encompassing all five dimensions of Kingdom leadership. This leader has been assessed, formed, and commissioned for the assignment ahead.</p>';

  html += '<div class="dimensions">';
  html += '<span class="dim">Calling</span>';
  html += '<span class="dim">Connection</span>';
  html += '<span class="dim">Competency</span>';
  html += '<span class="dim">Capacity</span>';
  html += '<span class="dim">Convergence</span>';
  html += '</div>';

  html += '<p class="date-line">Completed on ' + dateStr + '</p>';
  html += '<div class="sig-block"><div class="sig-line">';
  html += '<p class="sig-name">Will Meier</p>';
  html += '<p class="sig-title">Founder & Director<br/>Awakening Destiny Global</p>';
  html += '</div></div>';

  html += '</div>';
  html += '<p class="footer-text">Called to Carry · 5C Leadership Blueprint · Awakening Destiny Global · awakeningdestiny.global · From Design to Destiny</p>';
  html += '</div>';
  html += '</body></html>';

  var win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.onload = function() { win.print(); };
}