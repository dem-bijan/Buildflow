"use client";

import { useState } from "react";
import SignInModal from "@/components/SIgnInPage";
import SplitText from "@/components/SplitText";
import TargetCursor from '@/components/TargetCursor';
import { LogIn, FilePen, ChevronDown } from "lucide-react";
import ButtonStyled from '@/components/button';
import ThemeToggle from "@/components/themeprovider";
import SignUpModal from "@/components/SignUp";

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen w-screen justify-center">
      {/* ── Navbar ── */}
      <header className="flex-none flex flex-row items-start w-screen justify-center relative">
        <nav className="flex flex-row w-full max-w-[90vw] md:max-w-[80vw] items-center justify-between mt-4 md:mt-5 gap-2 md:gap-4 bg-transparent">
          <TargetCursor spinDuration={0.9} hideDefaultCursor={false} parallaxOn hoverDuration={0.1} cursorColor="#ffffff" cursorColorOnTarget="#e91c22" />

          {/* Logo / brand placeholder */}
          <div className="flex justify-start items-center min-w-0">
            <span className="text-white font-mono font-bold text-sm md:text-lg truncate">Buildflow</span>
          </div>

          {/* Controls & CTA buttons */}
          <div className="flex flex-row items-center gap-2 md:gap-4">
            {/* Theme Toggle (Visible everywhere now, styled nicely) */}
            <div className="flex items-center justify-center mr-1 md:mr-2">

            </div>

            {/* Sign Up Button & Modal */}
            <div className="flex flex-col items-center justify-center">
              <ButtonStyled
                className="cursor-target text-[11px] bg-transparent md:text-[13px] px-4 md:px-7 py-2.5 md:py-4"
                onClick={() => setShowSignUp(true)}
                text="Inscrivez-vous"
                icon={FilePen}
              />
              <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
            </div>

            {/* Sign In Button & Modal */}
            <div className="flex flex-col items-center justify-center">
              <ButtonStyled
                className="cursor-target text-[11px] md:text-[13px] bg-[#000000]/20 px-4 md:px-7 py-2.5 md:py-4"
                onClick={() => setShowSignIn(true)}
                text="Connexion"
                icon={LogIn}
              />
              <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
            </div>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col justify-center items-center w-screen px-4">
        <div>
          <SplitText
            text="Buildflow"
            className="text-5xl sm:text-6xl md:text-8xl cursor-target font-mono text-center"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
        </div>
        <div className="mb-10 md:mb-40 ml-0 md:ml-40 mt-2 md:mt-0">
          <SplitText
            text="Fast , Smart & Secure"
            className="text-lg sm:text-xl md:text-2xl text-center font-script"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
        </div>
      </main>

      {/* ── Scroll indicator ── */}
      <div className="flex-none flex flex-row w-screen justify-center items-center pb-4 md:pb-6">
        <div className="animate-[bounce_1.5s_ease-in-out_infinite] scale-125 md:scale-150">
          <ChevronDown size={32} className="md:w-10 md:h-10" />
        </div>
      </div>
    </div>
  );
}