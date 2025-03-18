import { Pizza } from "lucide-react";

export default function DemoSection() {
  return (
    <section className="relative">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 m:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40
        -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-30"
        >
          <div
            style={{
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678]
            w-[36.125rem] -translate-x-1/2 rotate-[30deg]
            bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500
            opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
          />
        </div>
        <div>
          <Pizza className="w-6 h-6 text-rose-600" />
          <h3>
            Watch how Sommaire transforms this Next.js course PDF into an
            easy-to-read summary!
          </h3>
        </div>
      </div>
    </section>
  );
}
