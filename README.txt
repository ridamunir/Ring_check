MyRingCheck — README (Nomi ke liye)
====================================
Roman Urdu + English. Ye file sirf tumhare liye hai — deploy aur Admin Panel ka poora tareeqa is mein hai.
No coding needed. Tum sirf deploy karo ge, baaki sab code mein bana hua hai.

YE PROJECT KYA HAI
------------------
Asal Next.js + Tailwind + Supabase site — React preview NAHI hai, hash URLs NAHI hain.
Har page ka apna clean URL hai: /number/02079460958/ , /scam-calls/hmrc-scam-calls/ , /area-code/020/ , /blog/...
Stack: Next.js 14 (App Router) + Tailwind + Supabase (Postgres) + TinyMCE admin editor.
Admin Panel: Admin Panel v4 template (final, tay hua wala) — site ke andar /admin par, usi Supabase se connected.
Domain abhi khareeda NAHI gaya — myringcheck.com checkout par dobara check karna.

TUMHARI 3 FAISLE (21 Nov 2026) — CODE MEIN LAGAY HUAY HAIN
----------------------------------------------------------
1. SEARCHES HIDDEN: Site par kahin bhi search count NAHI dikhega (number page, Top list, homepage — kahin nahi).
   Lekin backend mein counting chalti rahegi — har search database mein save hoti hai, aur 5+ searches wala index rule bhi chalta rahega.
   Jab asal data aa jaye to tum kaho ge, tab display on kar dena.
2. SEEDED 20 INDEXABLE: Jo 20 research-based numbers seed mein hain, wo launch se hi INDEX honge — noindex nahi, sitemap mein bhi hain.
   Naya number (user search/report se bana) noindex rahega jab tak 1 approved report na aa jaye ya 5+ searches na ho jayen — phir auto index.
3. VOTES: Koi vote invent NAHI kiya. Har approved report ek Unsafe signal hai — Unsafe count = reports + asal Unsafe votes.
   Page par saaf likha hai ke count reports se bana hai. Safe votes 0 hon to 0 NAHI dikhega — "no safe votes yet" likha hoga.

PEHLE — SUPABASE PROJECT (15-20 minute)
-----------------------------------------
1. supabase.com par jao, login karo, New Project dabao.
2. Project name: myringcheck. Database password banao aur safe jagah likh kar rakh lo.
3. Region select karo (ek dafa select ho jaye to change nahi hota). Create new project — 1-2 minute mein ready.
4. Har tool ke liye ALAG Supabase project banao — iski database kisi aur tool se mix nahi.

STEP 1 — TABLES BANAO: schema.sql
-----------------------------------
1. Supabase Dashboard > left menu SQL Editor > New query.
2. Is project ki file supabase/schema.sql kholo, PURA content copy karo, SQL Editor mein paste karo, Run dabao.
3. Ye tables banata hai: pages, sections, variables, admin_users, languages, numbers, reports, votes, searches, messages.
   Sath mein indexes, updated_at trigger aur RLS policies bhi lag jati hain.
4. Check: Table Editor mein ye 10 tables dikhni chahiye. admin_users khaali hogi — user abhi nahi banta, wo Step 5 mein banega.

STEP 2 — SEED DATA BHARO: seed.sql
-----------------------------------
1. SQL Editor mein dobara New query kholo.
2. File supabase/seed.sql ka PURA content copy karo, paste karo, Run dabao.
3. Ye daalta hai:
   - 25 launch pages (P0) — Homepage (Who Called Me tool), About, Contact, FAQs, How It Works, Spam Score, Report a Number,
     Privacy, Terms, Disclaimer, Cookie, Top Reported, Latest Reports, Reverse Phone Lookup, Scam Calls hub + HMRC + Bank,
     Area Codes hub + 020 + 07, Report a Scam Call UK guide
   - 5 blog posts (DRAFT / dummy content — tum khud final text likho ge, neeche dekho)
   - Predefined languages list + 1 Spanish demo homepage
   - 20 research-based UK numbers, 22 reports (har number par category + scam pattern)
   - Votes aur searches seed mein NAHI hain — wo sirf asal user actions se badhen ge.
4. Check: Table Editor > pages mein 26 rows honi chahiye (20 pages + 5 blogs + 1 Spanish homepage).
   Numbers table mein 20 rows, reports mein 22 rows.
5. Seed dobara chalana safe hai — on conflict do nothing likha hai, duplicate nahi banti.
6. TARTIB: pehle schema.sql, phir seed.sql. Ulta chalaya to fail hoga.

STEP 3 — EMAIL LOGIN ON KARO
----------------------------
1. Supabase Dashboard > Authentication > Providers > Email.
2. Email provider enable karo. "Confirm email" OFF rakh sakte ho — panel se banaye gaye users foran login kar sakte hain.

STEP 4 — API KEYS NOTE KARO
----------------------------
Supabase Dashboard > Project Settings > API se ye 3 cheezein note karo:
  Project URL            -> NEXT_PUBLIC_SUPABASE_URL
  anon public key        -> NEXT_PUBLIC_SUPABASE_ANON_KEY
  service_role key       -> SUPABASE_SERVICE_ROLE_KEY  (SECRET hai — kabhi code/GitHub/public jagah mat likho, sirf Vercel mein)
Optional: Storage > New bucket > naam "images", Public tick karo (featured-image upload ke liye). Bucket na bhi ho to URL field se kaam chalega.

STEP 5 — GITHUB + VERCEL DEPLOY
--------------------------------
1. GitHub par naya repo banao (jaise myringcheck).
2. Is zip ki saari files drag-drop se upload karo. .env.local kabhi upload mat karo — wo .gitignore mein hai.
3. vercel.com > Add New > Project > repo select karo > Import. Framework Next.js auto-detect ho jayega.
4. Environment Variables mein ye lagao:
   NEXT_PUBLIC_SUPABASE_URL = Supabase Project URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY = anon key
   SUPABASE_SERVICE_ROLE_KEY = service_role key
   NEXT_PUBLIC_SITE_URL = https://myringcheck.com (ya jo domain lagao ge)
   ADMIN_PASSWORD = ek strong temporary password (sirf pehla admin banane ke liye — neeche Step 6, Tareeqa 2)
5. Deploy dabao. 1-2 minute mein site live ho jayegi.
6. Env vars badalne ke baad Redeploy ZARURI hai — warna nayi values nahi lagti.

STEP 6 — PEHLA ADMIN BANAO (koi ek tareeqa chuno)
-------------------------------------------------
Login email + password se hota hai (Supabase Auth). /admin/login par jao.

Tareeqa 1 — Supabase Dashboard se (ADMIN_PASSWORD ki zaroorat nahi):
1. Supabase Dashboard > Authentication > Users > Add user. Email + password likho, "Auto Confirm User" tick karo, Create user dabao.
2. Us user ki row kholo, User UID copy karo.
3. SQL Editor > New query mein ye chalao (apna naam aur UID daal kar):
   insert into admin_users (id, name, role) values ('PASTE-USER-UID-HERE', 'Your Name', 'admin');
4. Ab /admin/login par us email + password se login karo.

Tareeqa 2 — Bootstrap (sab se aasan):
1. Vercel > project > Settings > Environment Variables mein ADMIN_PASSWORD lagao > Redeploy.
2. /admin/login par koi bhi email (jaise aap@gmail.com) + wahi ADMIN_PASSWORD daal kar login karo. Ye sirf tab kaam karta hai jab admin_users table BILKUL khaali ho.
3. Dashboard par laal banner dikhega: "Bootstrap mode". Users > Add New User se apna asal admin account banao (email + password + Role: Admin).
4. Naye admin se logout kar ke dobara login karo — ab normal Supabase login hai.
5. ZARURI: Vercel se ADMIN_PASSWORD DELETE karo aur Redeploy karo.

STEP 7 — DOMAIN LAGAO (jab khareed lo)
---------------------------------------
1. Domain khareedo (myringcheck.com — checkout par availability dobara check karna).
2. Vercel > project > Settings > Domains > domain add karo, aur domain registrar par Vercel ke bataye hue DNS records lagao.
3. Domain lagte hi clean URLs khud chal jayengi — /number/... , /scam-calls/... — alag se kuch set nahi karna.
   Domain sirf address hai; URL structure code mein hai.

DEPLOY KE BAAD 5-MINUTE LIVE TEST
----------------------------------
1. Homepage par amber banner "Demo data — connect Supabase to save changes" NA ho.
2. /admin/login Gmail + password se chal jaye.
3. Dashboard par "DB Connected" green ho.
4. About Us ki heading badal kar front par check karo, phir wapas karo.
5. Kisi page ko Draft karo — uska public URL 404 de.
6. Ek number search karo: 07379 885614 — HMRC report wala page khulna chahiye, score ke sath.
7. /sitemap.xml kholo — 20 seeded number pages us mein hone chahiye.

ADMIN PANEL SE SAB KUCH KAISE MANAGE KARO GE
---------------------------------------------
Dashboard (/admin): Pages, Blogs, Drafts, Published, Users ke counts; Database Status (Connected green/red);
Export CSV / Export SQL button (poora content download); Moderate Reports aur Messages ke buttons.

Page ka content badalna:
  Pages > page kholo > upar URL, language, meta title, meta description, canonical dikhen ge.
  Neeche har section mein Variable Name + TinyMCE editor (uski Value) hai — headings H1-H6, link, list, code view, preview sab editor mein hai.
  Naya text section: + button dabao > Variable Name likho > editor mein content likho > Save/Publish.
  Hatana ho to − button. Publish karte hi front par aa jayega — dobara deploy NAHI chahiye. Draft page front par nahi dikhega.

Blog post likhna / badalna (5 launch posts DRAFT hain — tum khud final likho ge):
  Blogs > post kholo > title, URL, meta, editor mein content likho > Publish.
  Naya blog: Blogs > Add New. Featured image: /blog-*.svg files public/ mein hain, ya apni image ka URL daalo.
  Blog Hub page launch par NAHI hai — posts /blog/ ke neeche hain, homepage aur hub pages se link hain.

Reports approve / delete karna:
  Admin > Reports — nayi reports yahan pending rehti hain. Approve karo to number page par aa jayegi aur score badhega.
  Reject karo to publish nahi hogi. Fake report ko reject karo; galat report ki correction Contact Us > Messages se aati hai.

Users banana:
  Admin (sirf Admin role) > Users > Add New User — email + password + Role (Admin ya Editor).
  Edit email, Change Password, Delete — sab Users se. Apna account ya aakhri Admin delete nahi ho sakta.
  Editor sirf content badal sakta hai — Users aur foundational pages delete nahi kar sakta.

Languages (Settings > Languages):
  Predefined list (English default, Spanish enabled) + Custom Language add kar sakte ho.
  Har language ka apna page + apna translated slug hota hai, "Translation Of" se link hota hai.
  /en khud no-prefix par 301 karta hai. Jis language mein page ka translation nahi hai, uska URL 404 dega — English content kabhi doosri language mein nahi dikhega.

Messages dekhna:
  Admin > Messages — Contact Us form se aaye messages (number removal, report correction, business/API).

TOOL KE VARIABLES (20 naam — exact hone chahiye)
-------------------------------------------------
Homepage (slug "") par ye variables pehle se seed mein hain. Agar kabhi dobara banao to naam BILKUL exact likhna — ek harf ka farq ho to tool ko text nahi milega:
Search Box: search_label, search_placeholder, search_button_text, search_hint, search_error_empty, search_error_invalid
Unknown result: result_unknown_heading, result_unknown_text, result_first_report_cta
Reported result: result_score_label, result_reports_label, result_origin_label, result_origin_note
Vote + Report: vote_safe_button, vote_unsafe_button, vote_thanks, report_heading, report_submit_button, report_thanks
Trust note: trust_note
Agar koi variable admin mein na ho to tool code mein likha default English text dikhayega — khaali jagah nahi.

AGAR KUCH KHARAB HO TO
----------------------
- Homepage par amber banner "Demo data": Supabase connect nahi hua — Vercel mein 3 env vars check karo, phir Redeploy karo.
- 503 error: Supabase env vars ghalat ya project pause hai — Supabase Dashboard mein project status dekho.
- /admin/login nahi khul raha: Email provider enable hai ya nahi check karo (Step 3), aur pehla admin Step 6 se banao.
- Page edit ke baad front par nahi badla: page Published hai ya Draft check karo; phir page refresh karo (public pages force-dynamic hain, deploy nahi chahiye).
- Number search nahi chal raha: number UK format mein hai ya nahi check karo — +92 ya letters nahi chalte, 10 digits se chhota nahi chalta.
- Build fail (Vercel): zip ki files poori upload hui hain ya nahi check karo — poora zip replace karna zyada safe hai, file-by-file nahi.

KYA ABHI NAHI HAI (khula hua)
------------------------------
- Domain khareeda nahi gaya; Vercel/Supabase accounts banane hain (tumhare accounts, password kabhi share mat karo).
- Real Supabase save / Auth flow live deploy par test nahi hua — pehla live test hi proof hoga (upar 5-minute test dekho).
- FAQs page ka content code mein hai (lib/site.js) — accordion ke H3 structure ki wajah se; baad mein panel se bhi manage ho sakta hai.
- USA/Canada/Australia aur Spain/France Phase 2/3 hain — abhi sirf UK.

FILES IS PROJECT MEIN
---------------------
app/            Next.js pages (homepage tool, /number/[number]/, top/latest/report/search/faqs/contact, /scam-calls/[slug]/, /area-code/[slug]/, /blog/)
components/     SiteChrome (header/footer), SearchBox, FaqAccordion, VoteButtons, ReportForm, ContactForm, PageEditor, TinyEditor
lib/            numbers.js (normalise/score/origin), tool-data.js (Supabase + fallback), data.js, auth.js, session.js, languages.js
supabase/       schema.sql (pehle chalao), seed.sql (phir chalao)
public/         logo.webp, blog-*.svg illustrations, tinymce/
app/admin/      Dashboard, Pages, Blogs, Users, Reports (moderation), Messages, Settings > Languages
README.txt      Ye file. DEPLOY.md template ka purana guide hai — is README ko follow karo.
