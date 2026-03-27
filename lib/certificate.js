// lib/certificate.js
// Generates a downloadable completion certificate for the 5C Leadership Blueprint

export function downloadCertificate(userName, completionDate) {
  var dateStr = completionDate || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  var name = userName || "Leader";

  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"/><style>';
  html += '@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap");';
  html += '@page { size: landscape; margin: 0; }';
  html += 'body { margin: 0; padding: 0; font-family: "Outfit", sans-serif; background: #FDF8F0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  html += '.cert { width: 100%; max-width: 1000px; margin: 0 auto; padding: 60px; box-sizing: border-box; position: relative; min-height: 700px; background: #FDF8F0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  html += '.border-outer { position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; border: 3px solid #C8A951; border-radius: 4px; }';
  html += '.border-inner { position: absolute; top: 28px; left: 28px; right: 28px; bottom: 28px; border: 1px solid #C8A951; border-radius: 2px; }';
  html += '.content { position: relative; z-index: 1; text-align: center; padding: 40px 60px; }';
  html += '.logo-area { margin-bottom: 24px; }';
  html += '.org-name { font-size: 13px; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 600; color: #C8A951; margin-bottom: 8px; }';
  html += '.cert-title { font-family: "Cormorant Garamond", serif; font-size: 42px; font-weight: 700; color: #021A35; margin: 0 0 4px 0; line-height: 1.2; }';
  html += '.cert-subtitle { font-family: "Cormorant Garamond", serif; font-size: 18px; font-weight: 400; color: #6b7280; font-style: italic; margin: 0 0 32px 0; }';
  html += '.presented { font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px; }';
  html += '.recipient { font-family: "Cormorant Garamond", serif; font-size: 38px; font-weight: 700; color: #021A35; margin: 0 0 8px 0; padding-bottom: 8px; border-bottom: 2px solid #C8A951; display: inline-block; }';
  html += '.completion-text { font-size: 14px; color: #555; line-height: 1.8; max-width: 600px; margin: 20px auto 28px; }';
  html += '.dimensions { display: flex; justify-content: center; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }';
  html += '.dim { padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.05em; }';
  html += '.date-line { font-size: 13px; color: #888; margin-bottom: 32px; }';
  html += '.signature-area { display: flex; justify-content: center; gap: 80px; margin-top: 20px; }';
  html += '.sig-block { text-align: center; min-width: 200px; }';
  html += '.sig-line { border-top: 1px solid #021A35; padding-top: 8px; margin-top: 40px; }';
  html += '.sig-name { font-size: 14px; font-weight: 700; color: #021A35; }';
  html += '.sig-title { font-size: 11px; color: #888; }';
  html += '.footer-text { position: absolute; bottom: 40px; left: 0; right: 0; text-align: center; font-size: 10px; color: #aaa; }';
  html += '.corner { position: absolute; width: 40px; height: 40px; border-color: #C8A951; }';
  html += '.corner-tl { top: 36px; left: 36px; border-top: 2px solid; border-left: 2px solid; }';
  html += '.corner-tr { top: 36px; right: 36px; border-top: 2px solid; border-right: 2px solid; }';
  html += '.corner-bl { bottom: 36px; left: 36px; border-bottom: 2px solid; border-left: 2px solid; }';
  html += '.corner-br { bottom: 36px; right: 36px; border-bottom: 2px solid; border-right: 2px solid; }';
  html += '</style></head><body>';
  html += '<div class="cert">';
  html += '<div class="border-outer"></div>';
  html += '<div class="border-inner"></div>';
  html += '<div class="corner corner-tl"></div>';
  html += '<div class="corner corner-tr"></div>';
  html += '<div class="corner corner-bl"></div>';
  html += '<div class="corner corner-br"></div>';
  html += '<div class="content">';

  // Logo area — text only
  html += '<div class="logo-area">';

  // Title
  html += '<p class="org-name">Awakening Destiny Global</p>';
  html += '<h1 class="cert-title">Certificate of Completion</h1>';
  html += '<p class="cert-subtitle">5C Leadership Blueprint</p>';

  // Recipient
  html += '<p class="presented">This certifies that</p>';
  html += '<h2 class="recipient">' + name + '</h2>';

  // Body
  html += '<p class="completion-text">has successfully completed the 5C Leadership Blueprint — a formation-based leadership development experience encompassing all five dimensions of Kingdom leadership. This leader has been assessed, formed, and commissioned for the assignment ahead.</p>';

  // Dimensions
  html += '<div class="dimensions">';
  html += '<span class="dim" style="background: rgba(200,169,81,0.15); color: #C8A951;">Calling</span>';
  html += '<span class="dim" style="background: rgba(0,174,239,0.1); color: #00AEEF;">Connection</span>';
  html += '<span class="dim" style="background: rgba(1,114,188,0.1); color: #0172BC;">Competency</span>';
  html += '<span class="dim" style="background: rgba(244,119,34,0.1); color: #F47722;">Capacity</span>';
  html += '<span class="dim" style="background: rgba(238,49,36,0.1); color: #EE3124;">Convergence</span>';
  html += '</div>';

  // Date
  html += '<p class="date-line">Completed on ' + dateStr + '</p>';

  // Signature
  html += '<div class="signature-area">';
  html += '<div class="sig-block"><div class="sig-line"><p class="sig-name">Will Meier</p><p class="sig-title">Founder & Director<br/>Awakening Destiny Global</p></div></div>';
  html += '</div>';

  html += '</div>'; // content
  html += '<p class="footer-text">5C Leadership Blueprint · Awakening Destiny Global · awakeningdestiny.global · From Design to Destiny</p>';
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