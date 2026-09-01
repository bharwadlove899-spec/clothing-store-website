import re

with open('src/components/ProductModal.tsx', 'r') as f:
    content = f.read()

old_notice = """                  {/* Instructions Notice */}
                  <div className="mb-6 p-4 border border-zinc-800 bg-black/30 rounded-md">
                    <p className="text-xs text-zinc-300 leading-relaxed font-light">
                      <span className="font-bold text-primary uppercase tracking-widest text-[10px] block mb-2">📌 Notice / ध्यान दें</span>
                      जो भी प्रोडक्ट पसंद आए उसका स्क्रीनशॉट लीजिए, अपनी डिटेल्स (Mobile, Address) भरिए और नीचे दिए गए <b>Buy via WhatsApp</b> बटन पर क्लिक करें। WhatsApp में रीडायरेक्ट होने के बाद, कृपया प्रोडक्ट का स्क्रीनशॉट अटैच करके मैसेज सेंड करें।
                    </p>
                  </div>"""

new_notice = """                  {/* Instructions Notice */}
                  <div className="mb-6 space-y-3">
                    <div className="p-3 border border-red-900/30 bg-red-900/10 rounded-md">
                      <p className="text-xs text-red-400 font-bold tracking-wide uppercase flex items-center gap-2">
                        <span>🚫</span> COD Not Available / कैश ऑन डिलीवरी उपलब्ध नहीं है
                      </p>
                    </div>
                    <div className="p-4 border border-zinc-800 bg-black/30 rounded-md">
                      <p className="text-xs text-zinc-300 leading-relaxed font-light">
                        <span className="font-bold text-primary uppercase tracking-widest text-[10px] block mb-2">📌 Notice / ध्यान दें</span>
                        जो भी प्रोडक्ट पसंद आए उसका स्क्रीनशॉट लीजिए, अपनी डिटेल्स (Mobile, Address) भरिए और नीचे दिए गए <b>Buy via WhatsApp</b> बटन पर क्लिक करें। WhatsApp में रीडायरेक्ट होने के बाद, कृपया प्रोडक्ट का स्क्रीनशॉट अटैच करके मैसेज सेंड करें।
                      </p>
                    </div>
                  </div>"""

content = content.replace(old_notice, new_notice)

with open('src/components/ProductModal.tsx', 'w') as f:
    f.write(content)

