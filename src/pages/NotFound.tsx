import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 font-mono text-[#d4d4d4]">
      <div className="w-full max-w-md">
        <p className="text-[#5fbf5f]">
          $ cd /requested-page
        </p>
        <p className="mt-1 text-red-400">
          zsh: no such file or directory: /requested-page
        </p>
        <p className="mt-4 text-sm text-[#9a9a9a]">404 — this path doesn't exist.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-[#7fb3ff] underline underline-offset-2"
        >
          cd ~
        </Link>
      </div>
    </div>
  );
}
