// lib/certificate.js
// Generates a downloadable completion certificate for the 5C Leadership Blueprint

export function downloadCertificate(userName, completionDate) {
  var dateStr = completionDate || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  var name = userName || "Leader";

  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"/><style>';
  html += '@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap");';
  html += '@page { size: 11in 8.5in landscape; margin: 0; }';
  html += '* { box-sizing: border-box; margin: 0; padding: 0; }';
  html += 'html, body { width: 11in; height: 8.5in; background: #021A35; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  html += '.cert { width: 11in; height: 8.5in; position: relative; background: #021A35; font-family: "Outfit", sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; overflow: hidden; }';
  html += '.border-outer { position: absolute; top: 22px; left: 22px; right: 22px; bottom: 22px; border: 2px solid #C8A951; border-radius: 3px; }';
  html += '.border-inner { position: absolute; top: 30px; left: 30px; right: 30px; bottom: 30px; border: 1px solid rgba(200,169,81,0.35); border-radius: 2px; }';
  html += '.corner { position: absolute; width: 44px; height: 44px; }';
  html += '.corner-tl { top: 38px; left: 38px; border-top: 2px solid #FDD20D; border-left: 2px solid #FDD20D; }';
  html += '.corner-tr { top: 38px; right: 38px; border-top: 2px solid #FDD20D; border-right: 2px solid #FDD20D; }';
  html += '.corner-bl { bottom: 38px; left: 38px; border-bottom: 2px solid #FDD20D; border-left: 2px solid #FDD20D; }';
  html += '.corner-br { bottom: 38px; right: 38px; border-bottom: 2px solid #FDD20D; border-right: 2px solid #FDD20D; }';
  html += '.content { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 50px 110px; z-index: 1; }';
  html += '.logo-area { margin-bottom: 20px; }';
  html += '.eyebrow { font-family: "Outfit", sans-serif; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 600; color: #C8A951; margin-bottom: 12px; }';
  html += '.cert-title { font-family: "Cormorant Garamond", serif; font-size: 50px; font-weight: 600; color: #FDF8F0; margin: 0 0 4px 0; line-height: 1.15; }';
  html += '.cert-subtitle { font-family: "Cormorant Garamond", serif; font-size: 16px; font-weight: 400; color: #C8A951; font-style: italic; margin: 0 0 20px 0; letter-spacing: 0.04em; }';
  html += '.divider { width: 120px; height: 1px; background: rgba(200,169,81,0.4); margin: 0 auto 16px; }';
  html += '.presented { font-size: 10px; color: rgba(253,248,240,0.5); text-transform: uppercase; letter-spacing: 0.18em; margin-bottom: 8px; }';
  html += '.recipient { font-family: "Cormorant Garamond", serif; font-size: 44px; font-weight: 700; color: #FDD20D; margin: 0 0 16px 0; line-height: 1.1; }';
  html += '.completion-text { font-size: 13px; color: rgba(253,248,240,0.75); line-height: 1.8; max-width: 600px; margin: 0 auto 20px; }';
  html += '.dimensions { display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }';
  html += '.dim { padding: 4px 14px; border-radius: 20px; font-size: 10px; font-weight: 600; letter-spacing: 0.06em; border: 1px solid; }';
  html += '.date-line { font-size: 11px; color: rgba(253,248,240,0.5); margin-bottom: 24px; letter-spacing: 0.08em; }';
  html += '.signature-area { display: flex; justify-content: center; }';
  html += '.sig-block { text-align: center; min-width: 220px; }';
  html += '.sig-line { border-top: 1px solid rgba(200,169,81,0.5); padding-top: 10px; margin-top: 32px; }';
  html += '.sig-name { font-size: 13px; font-weight: 700; color: #FDF8F0; letter-spacing: 0.04em; }';
  html += '.sig-title { font-size: 10px; color: rgba(253,248,240,0.5); margin-top: 3px; line-height: 1.6; }';
  html += '.footer-text { position: absolute; bottom: 38px; left: 0; right: 0; text-align: center; font-size: 9px; color: rgba(253,248,240,0.25); letter-spacing: 0.08em; }';
  html += '</style></head><body>';

  html += '<div class="cert">';
  html += '<div class="border-outer"></div>';
  html += '<div class="border-inner"></div>';
  html += '<div class="corner corner-tl"></div>';
  html += '<div class="corner corner-tr"></div>';
  html += '<div class="corner corner-bl"></div>';
  html += '<div class="corner corner-br"></div>';

  html += '<div class="content">';

  // Logo — inverted to white for navy background
  html += '<div class="logo-area">';
  html += '<img src="/images/adg-logo.png" alt="Awakening Destiny Global" style="height:48px;width:auto;filter:brightness(0) invert(1);" />';
  html += '</div>';

  // Title
  html += '<p class="eyebrow">Certificate of Completion</p>';
  html += '<h1 class="cert-title">Called to Carry</h1>';
  html += '<p class="cert-subtitle">5C Leadership Blueprint</p>';
  html += '<div class="divider"></div>';

  // Recipient
  html += '<p class="presented">This certifies that</p>';
  html += '<h2 class="recipient">' + name + '</h2>';

  // Body
  html += '<p class="completion-text">has successfully completed the Called to Carry 5C Leadership Blueprint — a formation-based leadership development experience encompassing all five dimensions of Kingdom leadership. This leader has been assessed, formed, and commissioned for the assignment ahead.</p>';

  // Dimensions
  html += '<div class="dimensions">';
  html += '<span class="dim" style="color:#C8A951;border-color:rgba(200,169,81,0.4);background:rgba(200,169,81,0.1);">Calling</span>';
  html += '<span class="dim" style="color:#00AEEF;border-color:rgba(0,174,239,0.4);background:rgba(0,174,239,0.1);">Connection</span>';
  html += '<span class="dim" style="color:#F47722;border-color:rgba(244,119,34,0.4);background:rgba(244,119,34,0.1);">Competency</span>';
  html += '<span class="dim" style="color:#EE3124;border-color:rgba(238,49,36,0.4);background:rgba(238,49,36,0.1);">Capacity</span>';
  html += '<span class="dim" style="color:#0172BC;border-color:rgba(1,114,188,0.4);background:rgba(1,114,188,0.1);">Convergence</span>';
  html += '</div>';

  // Date
  html += '<p class="date-line">Completed on ' + dateStr + '</p>';

  // Signature
  html += '<div class="signature-area">';
  html += '<div class="sig-block"><div class="sig-line"><p class="sig-name">Will Meier</p><p class="sig-title">Founder & Director<br/>Awakening Destiny Global</p></div></div>';
  html += '</div>';

  html += '</div>'; // content
  html += '<p class="footer-text">Called to Carry · 5C Leadership Blueprint · Awakening Destiny Global · awakeningdestiny.global · From Design to Destiny</p>';
  html += '</div>'; // cert
  html += '</body></html>';

  // Open in new window for printing
  var win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.onload = function() {
    win.print();
  };
}