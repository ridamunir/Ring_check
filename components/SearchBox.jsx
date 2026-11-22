
// Plain HTML form (GET to /search) — works with no JavaScript at all.
// The search page normalises the number and redirects to /number/<number>/.
export default function SearchBox({ label, placeholder, buttonText, hint, error }) {
  return (
    <form action="/search/" method="get" className="mt-4" role="search">
      <label htmlFor="number-search" className="mb-2 block font-semibold">{label || "Search an unknown number"}</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="number-search"
          name="number"
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder={placeholder || "e.g. 020 7946 0958"}
          className="flex-1 rounded-md border border-slate-300 px-4 py-3 text-lg"
          required
        />
        <button type="submit" className="rounded-md bg-[#00BFA6] px-6 py-3 text-lg font-bold text-[#0B1F3A]">
          {buttonText || "Check this number"}
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        {hint || "Free. No sign-up needed. We never publish a number owner's name or address."}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Any UK format works: 020 7946 0958, 07700 900123, +44 20 7946 0958, 0044 20 7946 0958, or +44 (0)20 7946 0958.
      </p>
      {error && <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">{error}</p>}
    </form>
  );
}
