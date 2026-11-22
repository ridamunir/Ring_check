
import { SiteChrome } from "@/components/SiteChrome";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact Us — MyRingCheck", description: "Contact MyRingCheck — ask a question, request a number removal, or correct a report." };

export default function ContactPage() {
  return (
    <SiteChrome>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1>Contact Us</h1>
        <p className="mt-3 text-slate-700">Use the form below. We read every message and reply as soon as we can.</p>
        <h2 className="mb-3 mt-8 text-xl font-bold">Number removal and corrections</h2>
        <p className="text-slate-700">If a number that belongs to you is wrongly reported, choose “Number removal” or “Report correction” below. Tell us the number and what is wrong, and we will review it.</p>
        <h2 className="mb-3 mt-8 text-xl font-bold">Business and API enquiries</h2>
        <p className="text-slate-700">If you run a call-blocking app, a security product or a telecom service and want to talk about our data, choose “Business / API”.</p>
        <div className="mt-6"><ContactForm /></div>
      </main>
    </SiteChrome>
  );
}
