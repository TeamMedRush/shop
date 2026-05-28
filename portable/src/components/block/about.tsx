import type { AuthSession, User } from "@interfaces/app";

interface AboutProps {
  session: AuthSession<User> | null;
}

const highlights = [
  {
    title: "Browse the live medicine catalog",
    description: "Shop reads from GET /api/v1/medicines and keeps local filtering fast without depending on query-string support.",
  },
  {
    title: "Carry a local cart safely",
    description: "Because the backend has no cart API yet, quantities and checkout prep stay in localStorage until the final order is placed.",
  },
  {
    title: "Stay honest about backend gaps",
    description: "Product detail, order detail, and richer fulfillment states fall back to cached data with clear TODO messaging instead of fake server responses.",
  },
];

export function About({ session }: AboutProps) {
  return (
    <section className="about">
      <div className="about__hero">
        <div className="about__copy">
          <p className="about__eyebrow">Customer medicine storefront</p>
          <h2>Order everyday medicines with a calmer, faster MedRush shopping flow.</h2>
          <p className="about__summary">
            Shop is built around the current MedRush backend contract: live customer auth,
            live catalog browsing, local cart management, and graceful checkout fallbacks where
            dedicated cart and detail APIs do not exist yet.
          </p>
        </div>

        <div className="about__actions">
          <a className="about__button about__button--primary" href={session ? "/products" : "/login"}>
            {session ? "Browse products" : "Sign in"}
          </a>
          <a className="about__button about__button--secondary" href={session ? "/orders" : "/register"}>
            {session ? "View orders" : "Create account"}
          </a>
        </div>
      </div>

      <div className="about__grid">
        {highlights.map((highlight) => (
          <article className="about__card" key={highlight.title}>
            <h3>{highlight.title}</h3>
            <p>{highlight.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

