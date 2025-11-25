import { useState } from "react";

export default function NewsletterCTA({
  bg = "/images/yeniSezon.png",
  title = "ÖZEL HABERLER & İÇERİKLER",
  subtitle = "Tüm gelişmelerden haberdar olmak için bültenimize katılın.",
  placeholder = "E-posta adresiniz",
  buttonLabel = "Kaydol",
  onSubmit,
}) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(email);
    else console.log("CTA signup:", email);
    setEmail("");
  };

  return (
    // üst bölümle bitişik, boşluksuz görünüm
    <section className="w-full relative pt-0 -mt-px">
      <div className="absolute inset-0">
        <img
          src={bg}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-10 py-16 md:py-24 text-center text-white">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="mt-4 text-base md:text-lg text-white/90 max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 mx-auto w-full max-w-xl flex items-center bg-white/95 rounded-full p-1 shadow"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent px-5 py-3 rounded-l-full text-black placeholder-black/50 outline-none"
            aria-label="E-posta"
          />
          <button
            type="submit"
            className="px-6 md:px-8 py-3 rounded-full bg-gold/90 hover:bg-gold text-black font-medium transition"
          >
            {buttonLabel}
          </button>
        </form>
      </div>
    </section>
  );
}
