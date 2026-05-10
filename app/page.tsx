import { Search, Star, ChevronRight, MapPin } from "lucide-react";

type Platform = {
  id: string;
  name: string;
  price: number;
  deliveryFee: number;
  eta: string;
  color: string;
};

type Restaurant = {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  reviews: number;
  location: string;
  platforms: Platform[];
};

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Sakura Sushi",
    cuisine: "Japanese",
    rating: 4.8,
    reviews: 342,
    location: "2.3 mi away",
    platforms: [
      { id: "doordash", name: "DoorDash", price: 22.5, deliveryFee: 1.99, eta: "30-40 min", color: "#FF3008" },
      { id: "ubereats", name: "Uber Eats", price: 24.99, deliveryFee: 2.99, eta: "25-35 min", color: "#5FB709" },
      { id: "grubhub", name: "Grubhub", price: 26.0, deliveryFee: 3.5, eta: "20-30 min", color: "#FC6D26" },
    ],
  },
  {
    id: 2,
    name: "Bella Napoli",
    cuisine: "Italian",
    rating: 4.6,
    reviews: 287,
    location: "1.8 mi away",
    platforms: [
      { id: "grubhub", name: "Grubhub", price: 17.5, deliveryFee: 2.5, eta: "20-30 min", color: "#FC6D26" },
      { id: "doordash", name: "DoorDash", price: 18.75, deliveryFee: 1.99, eta: "25-35 min", color: "#FF3008" },
      { id: "postmates", name: "Postmates", price: 19.99, deliveryFee: 3.99, eta: "30-45 min", color: "#FCCF4D" },
    ],
  },
  {
    id: 3,
    name: "El Patron",
    cuisine: "Mexican",
    rating: 4.7,
    reviews: 415,
    location: "1.2 mi away",
    platforms: [
      { id: "doordash", name: "DoorDash", price: 14.25, deliveryFee: 1.99, eta: "25-35 min", color: "#FF3008" },
      { id: "ubereats", name: "Uber Eats", price: 15.5, deliveryFee: 2.99, eta: "20-30 min", color: "#5FB709" },
    ],
  },
];

function getAveragePrice(platforms: Platform[]): number {
  return platforms.reduce((s, p) => s + p.price, 0) / platforms.length;
}

function getCheapest(platforms: Platform[]): Platform {
  return platforms.reduce((a, b) => (a.price < b.price ? a : b));
}

function formatDelta(price: number, average: number): string {
  const diff = price - average;
  if (diff < 0) return `-$${Math.abs(diff).toFixed(2)}`;
  if (diff > 0) return `+$${diff.toFixed(2)}`;
  return "$0.00";
}

function PlatformRow({ platform, cheapest, average }: { platform: Platform; cheapest: boolean; average: number }) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-4 py-3 transition-all hover:shadow-md ${
        cheapest ? "bg-[#e8f5e9] ring-1 ring-[#95d4b3]" : "bg-card"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: platform.color }}
        />
        <span className="label-sm text-muted-foreground uppercase">
          {platform.name}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className="price-lg text-foreground">${platform.price.toFixed(2)}</span>
          <span className="ml-2 text-xs text-muted-foreground">+${platform.deliveryFee.toFixed(2)}</span>
        </div>
        <span
          className={`hidden sm:inline text-xs font-medium ${
            platform.price < average ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {formatDelta(platform.price, average)}
        </span>
        <span className="hidden sm:inline text-xs text-muted-foreground">{platform.eta}</span>
        <a
          href="#"
          className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            cheapest
              ? "bg-[#fd8b00] text-white hover:bg-[#e67a00]"
              : "border border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          Order
          <ChevronRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const cheapest = getCheapest(restaurant.platforms);
  const average = getAveragePrice(restaurant.platforms);

  return (
    <div className="group flex flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between px-6 pb-2 pt-6">
        <div className="min-w-0">
          <h3 className="title-md text-foreground">{restaurant.name}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{restaurant.cuisine}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {restaurant.location}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5">
          <Star className="h-4 w-4 fill-[#fd8b00] text-[#fd8b00]" />
          <span className="text-sm font-semibold text-foreground">{restaurant.rating}</span>
          <span className="text-xs text-muted-foreground">({restaurant.reviews})</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-6 py-4">
        {restaurant.platforms
          .sort((a, b) => a.price - b.price)
          .map((platform) => (
            <PlatformRow
              key={platform.id}
              platform={platform}
              cheapest={platform.id === cheapest.id}
              average={average}
            />
          ))}
      </div>

      <div className="border-t border-border px-6 py-3">
        <a
          href="#"
          className="group/link flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-[#2d6a4f]"
        >
          Compare all prices
          <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}

const trending = ["Pizza", "Sushi", "Burgers", "Mexican", "Thai", "Salads"];

export default function Home() {
  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">F</span>
            </div>
            <span className="text-xl font-bold text-primary font-heading">Foodify</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Compare
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              About
            </a>
            <a
              href="#"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#2d6a4f]"
            >
              Sign In
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1280px] px-4 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-16">
            <div className="mx-auto max-w-[720px] text-center">
              <h1 className="display-lg text-foreground max-md:text-[36px] max-md:leading-[44px] max-sm:text-[28px] max-sm:leading-[36px]">
                Find the best price for your favorite food
              </h1>
              <p className="body-md mt-4 text-muted-foreground max-sm:text-sm">
                Compare prices across Uber Eats, DoorDash, Grubhub, and more. Save money on every order.
              </p>

              <div className="mx-auto mt-8 flex max-w-[560px] items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 transition-all focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(15,82,56,0.12)]">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for a dish or restaurant..."
                  className="min-w-0 flex-1 border-none bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Trending:</span>
                {trending.map((tag) => (
                  <button
                    key={tag}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background pb-20 pt-10">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-16">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="headline-lg text-foreground max-sm:text-[24px] max-sm:leading-[32px]">
                  Featured comparisons
                </h2>
                <p className="body-md mt-1 text-muted-foreground">Real-time prices from top delivery platforms</p>
              </div>
              <a
                href="#"
                className="hidden items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-[#2d6a4f] sm:flex"
              >
                View all <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>

            <a
              href="#"
              className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-[#2d6a4f] sm:hidden"
            >
              View all comparisons <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-8 lg:px-16">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <span className="text-[10px] font-bold text-primary-foreground">F</span>
            </div>
            <span className="text-sm font-semibold text-foreground">Foodify</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Foodify. Compare smart, save more.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-primary">
              Privacy
            </a>
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-primary">
              Terms
            </a>
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-primary">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
