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

  // Logo area — ADG flame SVG (no white background) + brand text
  html += '<div class="logo-area">';
  html += '<div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:16px">';
  html += '<svg viewBox="28 8 162 208" width="48" height="62" xmlns="http://www.w3.org/2000/svg">';
  html += '<path fill="#00AEEF" d="M64.11,142.48c2.74,5.12,6.46,9.44,10.72,13.36c5.8,5.33,12.49,9.22,19.72,12.16c4.22,1.72,8.7,3.08,13.23,3.33c1.8,0.1,3.38,1.13,5.31,0.7c1.8-0.4,3.8,0.17,5.64-0.12c4.72-0.75,9.48-1,14.11-2.69c3.4-1.25,6.67-2.73,9.89-4.28c3.34-1.61,6.44-3.74,9.17-6.33c1.99-1.89,4.47-3.39,6.05-5.56c2.15-2.94,4.37-5.85,6.19-9.08c2.42-4.3,4.18-8.8,5.58-13.48c0.56-1.87,0.81-3.85,1.08-5.79c0.09-0.69,0.29-1.28,0.67-2c0.53,3.51-0.23,6.82-0.7,10.09c-1.14,7.98-3.73,15.55-7.44,22.69c-1.89,3.63-3.77,7.37-6.29,10.55c-2.78,3.5-5.69,6.98-9.11,9.94c-2.15,1.86-4.05,4.11-6.45,5.55c-3.08,1.86-6.14,3.8-9.33,5.5c-5.02,2.68-10.4,4.39-15.78,5.95c-2.83,0.82-5.94,0.99-8.96,1.31c-3.93,0.41-7.86,0.38-11.76,0.25c-2.6-0.09-5.28-0.25-7.89-0.95c-3.63-0.97-7.38-1.43-10.96-2.64c-5.17-1.73-10.15-3.9-14.82-6.68c-5.76-3.43-11.02-7.56-15.54-12.53c-5.59-6.14-9.9-13.1-13.27-20.71c-2.36-5.33-3.6-10.95-4.82-16.56c-1.02-4.68-0.83-9.54-0.78-14.34c0.08-8.04,1.27-15.87,4.08-23.42c2.25-6.06,4.75-12,8.91-17.08c0.8-0.98,1.18-2.29,1.92-3.33c3.34-4.66,6.78-9.26,10.1-13.94c1.03-1.46,1.78-3.12,2.69-4.67c0.23-0.39,0.23-1.03,0.92-1.05c-1.16,5.01-2.42,10.01-3.45,15.05c-1.02,5.04-2.06,10.07-2.22,15.26c-0.06,1.93,0.2,3.91-0.26,5.84c-0.12,1.5-0.16,3,0.03,4.5c0.04,0.47,0.09,0.94,0.13,1.42l-0.1,0.13l0.15,0.09c-0.58,0.97,0.14,1.87,0.14,2.81c-0.01,4.03,0.8,7.98,1.63,11.88c1.64,7.74,4.27,15.18,7.88,22.23C61.28,138.12,62.18,140.63,64.11,142.48z"/>';
  html += '<path fill="#0172BC" d="M130,90.11c-3.68-3.33-6.87-7.14-10.26-10.75c-5.95-6.35-11.21-13.27-15.27-21.04c-4.19-8.01-5.78-16.53-5.05-25.45c0.37-4.46,1.71-8.77,3.31-12.98c0.15-0.38,0.16-0.71,0.67-0.68c0.57,0.04,0.42,0.48,0.5,0.82c0.71,3.06,1.77,5.98,3.01,8.89c2.01,4.75,4.8,8.95,7.91,12.95c2.88,3.7,6.26,6.95,9.91,9.94c5.52,4.53,11.53,8.36,17.31,12.51c10.68,7.66,18.51,17.65,23.59,29.83c1.52,3.66,2.36,7.47,2.82,11.29c0.37,3.01,1.25,6.02,0.8,9.15c-0.45,3.13-0.72,6.28-1.59,9.34c-0.86,3.01-1.81,5.97-3.12,8.82c-1.31,2.87-2.8,5.63-4.59,8.23c-1.75,2.55-3.77,4.87-5.87,7.16c-5.81,6.36-12.87,10.7-20.9,13.64c-2.61,0.95-5.25,1.34-8.01,1.61c-2.43,0.23-4.89,0.73-7.32,0.67c-2.28-0.05-4.77,0.57-6.86-1.02c-1.53,1.07-3.01,0.13-4.45-0.19c-2.49-0.57-5.01-1.1-7.19-2.56c0.76-0.01,1.53-0.13,2.26-0.01c4.48,0.7,8.96,0.75,13.42-0.05c10.36-1.86,18.57-7.17,24.63-15.73c3.63-5.12,5.47-10.89,6.33-17.15c0.55-4.02,0.07-7.94-0.27-11.83c-0.26-2.97-1.77-5.89-3.01-8.71c-2.58-5.87-6.71-10.7-10.92-15.44C131.3,90.84,130.86,90.17,130,90.11z"/>';
  html += '<path fill="#F47722" d="M50.25,92.77c0.46-1.92,0.2-3.9,0.26-5.84c0.16-5.19,1.19-10.22,2.22-15.26c1.03-5.04,2.29-10.03,3.45-15.05c0.22-0.87,0.43-1.74,0.68-2.74c1.42,1.08,0.96,2.64,1.2,3.86c2.21,11.31,6.6,21.57,13.87,30.61c5.7,7.09,12.81,12.33,20.72,16.63c3.84,2.09,7.87,3.72,12.05,4.97c3.05,0.91,6.15,1.64,9.5,2.53c-2.53,0.67-4.78,1.51-7.28,1.31c-1.33-0.11-2.52,0.7-3.91,0.81c-4.25,0.33-8.46,0.41-12.71-0.1c-5.64-0.68-10.94-2.36-15.94-4.96c-2.77-1.44-5.5-3.03-7.86-5.11c-1.04-0.91-1.45-0.61-1.91,0.42c-1.35,3.02-1.65,6.29-2.25,9.48c-0.69,3.71-0.54,7.48-0.56,11.24c-0.03,5.75,0.99,11.35,2.34,16.9c-1.93-1.85-2.84-4.36-4.01-6.64c-3.61-7.05-6.23-14.49-7.88-22.23c-0.83-3.9-1.64-7.85-1.63-11.88c0-0.94-0.72-1.85-0.14-2.81c0.06-0.09,0.04-0.16-0.04-0.22c-0.04-0.47-0.09-0.94-0.13-1.41C50.42,95.78,50.41,94.28,50.25,92.77z"/>';
  html += '<path fill="#EE3124" d="M130,90.11c0.86,0.06,1.3,0.74,1.79,1.28c4.21,4.74,8.34,9.57,10.92,15.44c1.24,2.82,2.75,5.74,3.01,8.71c0.34,3.89,0.83,7.81,0.27,11.83c-0.86,6.25-2.7,12.02-6.33,17.15c-6.06,8.56-14.28,13.87-24.63,15.73c-4.46,0.8-8.94,0.75-13.42,0.05c-0.74-0.12-1.51,0-2.26,0.01c-3.4-1.15-6.6-2.72-9.64-4.61c-4.98-3.09-9.04-7.18-12.57-11.82c-1.16-1.53-2.28-3.08-3.42-4.63c0.43-0.27,0.77-0.13,1.09,0.1c5.67,4.11,11.91,6.61,18.94,7.39c6.52,0.72,12.71-0.12,18.57-2.93c4.15-2,8.3-4.14,11.45-7.67c2.65-2.97,5.21-5.99,6.99-9.62c2.83-5.8,4.4-11.84,4.16-18.33c-0.17-4.7-1.3-9.14-3.05-13.49C131.26,93.16,130.07,91.86,130,90.11z"/>';
  html += '<path fill="#FDD20D" d="M119.28,93.73c-11.66-0.06-21.91-2.99-31.16-9.16c-7.15-4.77-12.53-11.16-15.81-19.06c-1.86-4.48-2.8-9.35-2.42-14.27c0.32-4.07,1.42-7.98,3.34-11.66c2.34-4.48,5.37-8.32,9.49-11.28c0.62,0.33,0.34,0.9,0.35,1.34c0.02,2.33,0.03,4.66-0.04,6.99c-0.18,6.24,0.82,12.24,2.97,18.12c2.61,7.13,6.22,13.65,11.09,19.45c5.97,7.1,13.16,12.85,20.61,18.28C118.1,92.78,118.47,93.09,119.28,93.73z"/>';
  html += '</svg>';
  html += '<div style="text-align:left"><div style="font-family:Cormorant Garamond,serif;font-size:22px;font-weight:700;color:#021A35;line-height:1.1">Awakening Destiny</div><div style="font-family:Cormorant Garamond,serif;font-size:22px;font-weight:700;color:#FDD20D;line-height:1.1">Global</div></div>';
  html += '</div>';
  html += '</div>';

  // Title
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