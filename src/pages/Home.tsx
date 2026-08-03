import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import AsciiArt from "@/components/AsciiArt";
import meArt from "@/assets/ascii-art-me.txt?raw";
import titleArt from "@/assets/ascii-art-title.txt?raw";
import mobileTitleArt from "@/assets/ascii-art-mobile-title.txt?raw";


const CONFIG = {
  user: "guest",
  machine: "Linux",
  host: "maliabeer.dev",
  cols: 159,
  rows: 52,
  bio: [
    "....is a builder & creator working at the intersection of technology, design, and human expression.",
    "Currently shipping small tools and writing about what's learned along the way, also working on a few side projects, like website development, Object Oriented Programming (OOPs), and open source contributions.",
    "Previously studied computer science, with a soft spot for HCI, generative systems, and terminals that look nicer than they need to.",
    "Diving into the world of web development, AI, Machine and Deep Learning. I craft innovative solutions that blend creativity with technology. My journey is fueled by a passion for learning and a commitment to excellence in every project I undertake."
  ],
  nav: [
    { label: "Portfolio", href: "https://ctrl-shift-ali.github.io/My-Portfolio/" },
    { label: "Github", href: "https://github.com/ctrl-shift-ali" },
    { label: "Contacts",
      OnClick: () => {
        const user = "maliabeer1127";
        const domain = "gmail.com";
        window.location.href = `mailto:${user}@${domain}`;
      }
    },
  ],
};
// ----------------------------------------------------------------------------

function useLastLogin() {
  return useMemo(() => {
    const now = new Date();
    const formatted = now
      .toDateString()
      .replace(/^(\w+) (\w+) (\d+) (\d+)$/, (_m, wd, mo, d, y) => {
        const day = d.padStart(2, " ");
        return `${wd} ${mo} ${day} ${y}`;
      });
    const time = now.toTimeString().slice(0, 8);
    return `${formatted} ${time}`;
  }, []);
}

export default function Home() {
  const lastLogin = useLastLogin();
  const [selected, setSelected] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const handleResize = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    handleResize(mediaQuery);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const openItem = (index: number) => {
    const item = CONFIG.nav[index];
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      toast(`${item.label} — coming soon`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => (i + 1) % CONFIG.nav.length);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) => (i - 1 + CONFIG.nav.length) % CONFIG.nav.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      openItem(selected);
    } else if (e.key.toLowerCase() === "q") {
      e.preventDefault();
      toast("can't quit a browser tab like that ;)");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-3 sm:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-white/10 shadow-2xl">
        {/* Title bar */}
        <div className="relative flex h-7 items-center bg-[#3a3a3c] px-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-16 text-center">
            <span className="truncate text-[11px] text-white/70">
              {CONFIG.user} — ssh.{CONFIG.host} — {CONFIG.cols}x{CONFIG.rows}
            </span>
          </div>
        </div>

        {/* Terminal body */}
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="bg-black px-4 py-4 font-mono text-[11px] leading-snug text-[#d4d4d4] outline-none sm:px-6 sm:py-6 sm:text-[12px]"
        >
          <p className="text-[#9a9a9a]">Welcome to the terminal homepage of maliabeer.dev!</p>
          <p className="mt-1">
            <span className="text-[#5fbf5f]">
              {CONFIG.user}@{CONFIG.machine}
            </span>
            <span className="text-white/60"> ~ % </span>
            <span>
              curl {CONFIG.host}
              <span className="cursor-blink ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-0.5 bg-[#d4d4d4] align-middle" />
            </span>
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:items-start">
            {/* Portrait */}
            <AsciiArt
              content={meArt}
              baseFontSize={8}
              maxScale={2}
              className="mt-3 w-full max-w-[420px] self-start text-[#ffffff] sm:max-w-[460px] md:max-w-[500px] max-h-[56rem]"
            />

            {/* Title + bio + nav */}
            <div className="flex min-w-0 flex-col gap-3">
              <div className="w-full min-w-0 text-[#d4ffda] bg-[#031204]/80 border border-[#70ff70]/20 rounded-[1.25rem] p-2 sm:p-3">
                <div className="ascii-glow w-full overflow-hidden select-none">
                  <AsciiArt
                    content={isMobile ? mobileTitleArt : titleArt}
                    baseFontSize={isMobile ? 8 : 14}
                    maxScale={1}
                    className="w-full max-w-full"
                  />
                </div>
              </div>

              <div className="max-w-xl space-y-2 text-[10px] leading-relaxed text-white/85 sm:text-[11px]">
                {CONFIG.bio.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              <div className="mt-1 flex flex-wrap gap-x-6 gap-y-3 text-[12px] sm:text-[13px]">
                {CONFIG.nav.map((item, i) =>
                  item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setSelected(i)}
                      className={
                        i === selected
                          ? "font-semibold text-[#5fbf5f]"
                          : "text-white/70 hover:text-white"
                      }
                    >
                      {i === selected ? "+ " : "  "}
                      {item.label}
                    </a>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => {
                        setSelected(i);
                        openItem(i);
                      }}
                      onMouseEnter={() => setSelected(i)}
                      className={
                        i === selected
                          ? "font-semibold text-[#5fbf5f]"
                          : "text-white/70 hover:text-white"
                      }
                    >
                      {i === selected ? "+ " : "  "}
                      {item.label}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <p className="mt-6 text-[10px] text-white/35 sm:text-[11px]">
            [← → to select · enter to open · q to quit]
          </p>
        </div>
      </div>
    </div>
  );
}
