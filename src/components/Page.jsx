import { forwardRef } from "react";

/**
 * Page
 * A single physical page inside the diary's HTMLFlipBook.
 * Every inner page shares the exact same parchment paper design —
 * only the children (content) change per page.
 *
 * Props:
 * - number: page number to print at the bottom (omit for covers)
 * - isHardCover: renders the leather cover design instead of parchment
 * - children: page content
 */
const Page = forwardRef(({ number, isHardCover = false, children }, ref) => {
  if (isHardCover) {
    return (
      <div ref={ref} className="relative w-full h-full overflow-hidden select-none">
        {/* leather base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 140% at 30% 15%, #8a5a34 0%, #6b4326 35%, #4a2d18 70%, #2e1b0f 100%)",
            boxShadow:
              "inset 0 0 120px rgba(0,0,0,0.65), inset 0 0 40px rgba(0,0,0,0.5)",
          }}
        />
        {/* leather grain */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px, transparent 2px, transparent 5px)",
          }}
        />
        {/* gold-tooled border */}
        <div className="absolute inset-4 border-2 border-[#c9a86a]/40 rounded-sm pointer-events-none" />
        <div className="absolute inset-6 border border-[#c9a86a]/25 rounded-sm pointer-events-none" />
        {/* warm edge shadow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 90px rgba(0,0,0,0.55)" }}
        />
        <div className="relative z-10 w-full h-full flex items-center justify-center p-10">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden select-none">
      {/* parchment base */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #f3e7c9 0%, #ecdcb3 45%, #e4d1a1 100%)",
        }}
      />
      {/* ruled notebook lines */}
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(107,78,45,0.18) 28px)",
          backgroundPosition: "0 64px",
        }}
      />
      {/* left margin rule */}
      <div className="absolute top-0 bottom-0 left-14 w-px bg-red-900/20 pointer-events-none" />

      {/* coffee stains */}
      <div
        className="absolute -top-6 -right-8 w-40 h-40 rounded-full opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(101,67,33,0.5) 0%, rgba(101,67,33,0.15) 55%, transparent 75%)",
        }}
      />
      <div
        className="absolute bottom-10 left-6 w-24 h-24 rounded-full opacity-25 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(101,67,33,0.45) 0%, transparent 70%)",
        }}
      />

      {/* warm vignette shadow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 60px rgba(90,60,30,0.35)" }}
      />

      {/* content */}
      <div className="relative z-10 w-full h-full px-8 py-8 overflow-y-auto overflow-x-hidden">
        {children}
      </div>

      {/* page number */}
      {typeof number === "number" && (
        <div className="absolute bottom-3 w-full text-center text-[#6b4e2d]/70 text-sm italic font-serif pointer-events-none">
          {number}
        </div>
      )}
    </div>
  );
});

Page.displayName = "Page";

export default Page;