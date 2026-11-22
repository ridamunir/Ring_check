# DEPLOY.md — Admin Panel Deploy Guide

Ye ek **proper, complete Admin Panel** hai — mockup ya demo nahi. Isay reusable base ke tor par rakha gaya hai: har tool site ke sath is panel ki **ek copy** lagti hai (har copy ki apni database), is liye purani files mein jahan "template" word aya tha, us ka matlab sirf yehi reusable-base wala hai. Panel ki UI (labels, messages, errors) **English only** hai; ye guide Nomi ke liye Roman Urdu + English mein hai.

Roman Urdu + English, step by step. Total time: ~15–20 minutes.

## Step 1 — Supabase project banao (database)

1. [supabase.com](https://supabase.com) par jao, sign up / login karo, **New Project** banao.
2. Project khulne ke baad left menu mein **SQL Editor** → **New query**.
3. Is repo ki file `supabase/schema.sql` ka pura content copy karo, SQL Editor mein paste karo, **Run** dabao.
   - Ye 5 tables banata hai: `pages`, `sections`, `variables`, `admin_users`, `languages` — plus indexes, updated_at trigger aur RLS policies.
4. Phir dobara **New query** → `supabase/seed.sql` ka content paste karo → **Run**.
   - Ye 8 foundational pages (Homepage, About Us, Contact Us, Privacy Policy, Terms & Conditions, Disclaimer, Cookie Policy, FAQs), 2 blogs, 1 hub (2 sub-pages), 1 pillar (1 sub-page), 1 tool page, predefined languages ki list, aur 3 Spanish demo pages (translated slugs ke sath) daalta hai.
   - Seed mein koi user/password nahi hota — pehla admin neeche "How to create the first admin" wale section ke mutabiq banayein.
5. **Authentication → Providers → Email** kholo aur **Email provider enable** karo. "Confirm email" OFF rakh sakte ho — panel se banaye gaye users foran login kar sakte hain (email auto-confirm hota hai).
6. **Project Settings → API** se ye 3 cheezein note karo:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (ye secret hai — kabhi code mein ya public jagah mat likho)
7. (Optional, image upload ke liye) **Storage** → **New bucket** → naam `images`, **Public** tick karo. Agar bucket nahi banaya to upload fail hoga lekin URL field se image link daal kar save karna phir bhi chalega — save block nahi hoga.

## Step 2 — GitHub repo banao

1. [github.com](https://github.com) par **New repository** banao (naam: e.g. `admin-panel` ya apne tool ka naam).
2. Is folder ki saari files repo mein drag-drop karo (GitHub web UI se upload kar sakte ho, ya `git push` se).
3. `.env.local` kabhi upload mat karo — wo `.gitignore` mein hai.

## Step 3 — Vercel par deploy karo

1. [vercel.com](https://vercel.com) par login karo → **Add New → Project** → apna GitHub repo select karo → **Import**.
2. Framework **Next.js** auto-detect ho jaye ga. **Environment Variables** mein ye lagao (pehle 3 required hain):
   - `NEXT_PUBLIC_SUPABASE_URL` = Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key
   - `ADMIN_PASSWORD` = (OPTIONAL, sirf bootstrap ke liye) — pehla admin banane ke liye. Pehla admin banne ke baad isay Vercel se **hata dein** aur redeploy karein. Is ke baghair bhi site chalti hai, bas pehla admin Dashboard wale tareeqe se banana hota hai.
3. **Deploy** dabao. 1–2 minute mein site live ho jaye gi.
4. Check karo: `https://tumhari-site.vercel.app/` (demo content dikhna chahiye). `/admin/login` par pehle neeche wala "Pehla admin" step kar ke login karein — Supabase connect kiye baghair login nahi hota.

## Step 4 — Content edit karo (deploy ki zaroorat nahi)

1. `/admin` par login karo.
2. **Pages** se page kholo, ya **Blogs** se blog kholo.
3. Top fields (URL, Language Code, Meta Title, Meta Description, Canonical) aur sections/variables TinyMCE mein badlo.
4. **Save** dabao — success message aye ga. **View Live Page** se check karo: tabdeeli foran live hai, **dobara deploy karne ki zaroorat nahi**.
5. Naya section: **+ Add New Section**. Naya variable: variable ke samne green **+**. Delete: red **−** (pehle confirm poche ga).

## Pehla admin kaise banayein — How to create the first admin (3 tareeqe — koi ek chunein)

Login email + password se hota hai (Supabase Auth). Pehla admin banane ke 3 tareeqe hain:

**Tareeqa 1 — Supabase Dashboard se (ADMIN_PASSWORD ki zaroorat nahi):**
1. Supabase Dashboard → **Authentication → Users → Add user**.
2. Email + password likhein, **"Auto Confirm User"** tick karein, **Create user** dabao.
3. Us user ki row kholo, us ka **User UID** copy karo.
4. **SQL Editor → New query** mein ye chalao (apna naam aur UID daal kar):
   ```sql
   insert into admin_users (id, name, role)
   values ('PASTE-USER-UID-HERE', 'Your Name', 'admin');
   ```
5. Ab `/admin/login` par us email + password se login karein.

**Tareeqa 2 — Bootstrap (sab se aasan, phir ADMIN_PASSWORD hata dein):**
1. Vercel → project → **Settings → Environment Variables** mein `ADMIN_PASSWORD` = ek strong temporary password lagao → **Redeploy**.
2. `/admin/login` par **koi bhi email** (e.g. aap@gmail.com) + wahi `ADMIN_PASSWORD` daal kar login karein. Ye sirf tab kaam karta hai jab `admin_users` table **bilkul khaali** ho — pehla admin banne ke baad ye rasta khud band ho jata hai.
3. Dashboard par laal banner dikhe ga: "Bootstrap mode". **Users → Add New User** se apna asal admin account banayein (email + password + Role: Admin).
4. Naye admin se logout kar ke dobara login karein — ab normal Supabase login hai.
5. **ZAROORI:** Vercel se `ADMIN_PASSWORD` delete karein aur **Redeploy** karein. Jab tak ye laga rahe ga, bootstrap rasta technically khula rehta hai (lekin users banne ke baad kaam nahi karta).

**Tareeqa 3 — Panel se (jab koi Admin pehle se login ho):**
- Koi Admin login kar ke **Users → Add New User** se naya user banata hai. Pehla user is tareeqe se nahi ban sakta — us ke liye Tareeqa 1 ya 2 chahiye.

## Naya user kaise add karein

1. Admin account se login karein → **Users** → **Add New User**.
2. Name, Email, Password (kam se kam 8 characters) aur Role chunein:
   - **Admin** — sab kuch: users manage + foundational pages delete.
   - **Editor** — content (pages/blogs) edit kar sakta hai; users manage **nahi** kar sakta aur foundational pages delete **nahi** kar sakta.
3. **Create User** — naya user foran apne email + password se login kar sakta hai.

## Password kaise badlein / reset karein

- **Panel se:** Admin kisi bhi user ka password badal sakta hai — **Users** → user ki row mein **Change Password**. Har user apna khud ka password bhi wahin se badal sakta hai (apni profile khol kar).
- **Supabase Dashboard se:** Authentication → Users → user kholo → **Reset password** (ya user delete kar ke dobara banao).
- **Apna password bhool gaye ho (Admin):** neeche "Locked out" dekhein.

## Locked out ho gaye to kya karein

1. **Supabase Dashboard se:** Authentication → Users → apna user kholo → password reset karo, ya naya Admin user banao (Tareeqa 1).
2. **Bootstrap se (backup rasta):** Vercel mein `ADMIN_PASSWORD` dobara lagao → Redeploy → kisi bhi email + `ADMIN_PASSWORD` se login karo (ye sirf tab kaam karega jab `admin_users` khaali ho — agar users pehle se hain to ye rasta band hai; us soorat mein Dashboard wala tareeqa use karo) → **Users** se naya Admin banao → phir `ADMIN_PASSWORD` dobara hata do aur redeploy karo.

## Admin password kaise badlein

Login ab Supabase Auth se hai — koi ek shared `ADMIN_PASSWORD` nahi hai. Apna password badalne ke liye **Users → apni profile → Change Password** use karein. `ADMIN_PASSWORD` sirf temporary bootstrap ke liye hai; usay badalne ke liye Vercel → Settings → Environment Variables → value badlo → Redeploy.

## Agar Supabase connect na ho (demo mode)

- Env vars ke baghair public site **demo data** par chalti hai aur amber banner dikhata hai: "Demo data — connect Supabase to save changes". **Lekin admin login ke liye Supabase zaroori hai** — baghair Supabase ke `/admin/login` par 503 aye ga ("Supabase not configured"), password-only login nahi hota.
- Admin mein Save dabane par clear error aye ga. Fix: Step 3 ke 3 required env vars check karo (spelling + values), phir Vercel par **Redeploy** karo.
- Dashboard par **DB Connected** status bhi check kar sakte ho (`/api/admin/status`).

## Notes

- Har tool ke liye **alag Supabase project** banao (ek account, alag projects — recommended).
- Homepage ka slug (`/`) aur delete **locked** hai — galti se delete nahi hogi.
- Draft / Unpublished pages public site par **404** dete hain — sirf Published pages live dikhte hain.

## Multilingual — doosri language kaise add karein (v4)

English default language hai — us ke URL par koi prefix nahi (`/`, `/blog/...`). Baqi har language apne short code ke neeche ati hai: `/es`, `/es/blog/...`.

1. **Language enable karein:** Admin → **Settings → Languages**. Predefined list mein se language **Enable** karein (Spanish pehle se enabled hai). List mein na ho to neeche **Add a Custom Language** se naam + code khud likh dein — code hi URL prefix banta hai, ghalti na karein (`es` sahi hai, `sp` nahi).
2. **Page ka version banayein:** Pages → jo page translate karna hai us ke liye **New Page** banayein (ya blog ke liye New Blog), **Language** dropdown se wo language chunein (dropdown mein sirf enabled languages ati hain).
3. **Slug translate karein:** Slug bhi usi language mein likhein — sirf prefix nahi lagta, slug bhi badalta hai. Misal: English `/who-called-me` → Spanish `/es/quien-me-llamo`; blog `/blog/how-to-check-an-unknown-number` → `/es/blog/como-comprobar-un-numero-desconocido`.
4. **Link karein:** **Translation Of** mein English wala original page select karein. Isi link se panel har version par poora **hreflang** set khud banata hai (`en`, `es`, `x-default` → English version) — aap ko koi `<link>` tag haath se nahi likhna.
5. **Content translate karein:** Language code page ko translate nahi karta — headings, text aur meta usi language mein khud likhein. Meta title/description Spanish page par Spanish mein hi hon ge.
6. **Canonical:** Canonical field **khaali chhor dein** — panel har language ka canonical usi language ke apne URL par khud lagata hai (self-canonical). Spanish page ka canonical kabhi English URL par mat lagayein, warna Google Spanish page ko ignore kar de ga.
7. **Check karein:** Page khol kar source mein hreflang dekhein — bilkul paraphraser.io wale pattern par hoga: `x-default` aur `en` dono English URL par, `es` Spanish URL par. `<html lang>` aur OG locale bhi page ki language ke hisab se khud set hote hain.
8. **Purani site par update:** Agar Supabase project purane schema (v3) se bana tha, to `schema.sql` ke aakhir mein diya gaya **Migration (v3 → v4)** block ek dafa SQL Editor mein chalayein, phir `seed.sql` dobara chalayein.
