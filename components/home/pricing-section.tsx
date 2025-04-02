import { cn } from "@/lib/utils";
import Link from "next/link";

type PriceType = {
  id: number;
  name: string;
  price: number;
  description: string;
  items: string[];
  paymentLink: string;
};

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    description: "Perfect for ocassional use",
    items: [
      "5 PDF summaries per month",
      "Standard processing speed",
      "Email support",
    ],
    paymentLink: "",
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    description: "For professionals and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown Export",
    ],
    paymentLink: "",
  },
];

const PricingCard = ({
  name,
  price,
  description,
  items,
  id,
  paymentLink,
}: PriceType) => {
  return (
    <div className="relative w-full max-w-lg">
      <div
        className={cn(
          "relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 rounded-2xl border-[1px] border-gray-500/20"
        )}
      >
        <div className="flex justify-between items-center gap-4">
          <div>
            <p className="text-lg lg:text-xl font-bold  capitalize">{name}</p>
            <p className="text-base mt-2  ">{description}</p>
          </div>
        </div>
        <div>
          <p>${price}</p>
        </div>
        <div>
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </div>
        <div>
          <Link href={paymentLink}>Buy Now</Link>
        </div>
      </div>
    </div>
  );
};

export default function PricingSection() {
  return (
    <section>
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 m:px-6 lg:px-8 lg:pt-12">
        <div>
          <h2>Pricing</h2>
        </div>
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {plans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
