"use client";

import { useEffect, useState } from "react";
import { ChevronDown, FilePen, LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import SignInModal from "@/components/SIgnInPage";
import SignUpModal from "@/components/SignUp";
import SplitText from "@/components/SplitText";
import TargetCursor from "@/components/TargetCursor";
import ButtonStyled from "@/components/button";

export default function HomePageClient() {
  const searchParams = useSearchParams();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  function handleRegistered() {
    setShowSignUp(false);
    setShowSignIn(true);
  }

  useEffect(() => {
    if (searchParams.get("signin") === "1") {
      setShowSignIn(true);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center min-h-screen w-screen justify-center">
      <header className="flex-none flex flex-row items-start w-screen justify-center relative">
        <nav className="flex flex-row w-full max-w-[90vw] md:max-w-[80vw] items-center justify-between mt-4 md:mt-5 gap-2 md:gap-4 bg-transparent">
          <TargetCursor spinDuration={0.9} hideDefaultCursor={false} parallaxOn hoverDuration={0.1} cursorColor="#ffffff" cursorColorOnTarget="#e91c22" />

          <div className="flex justify-start items-center min-w-0">
            <span className="text-content-primary-dark font-mono font-bold text-sm md:text-lg truncate">Buildflow</span>
          </div>

          <div className="flex flex-row items-center gap-2 md:gap-4">
            <div className="flex items-center justify-center mr-1 md:mr-2"></div>

            <div className="flex flex-col items-center justify-center">
              <ButtonStyled
                className="cursor-target text-[11px] bg-transparent md:text-[13px] px-4 md:px-7 py-2.5 md:py-4"
                onClick={() => setShowSignUp(true)}
                text="Inscrivez-vous"
                icon={FilePen}
              />
              <SignUpModal
                isOpen={showSignUp}
                onClose={() => setShowSignUp(false)}
                onRegistered={handleRegistered}
                onSwitchToSignIn={() => {
                  setShowSignUp(false);
                  setShowSignIn(true);
                }}
              />
            </div>

            <div className="flex flex-col items-center justify-center">
              <ButtonStyled
                className="cursor-target text-[11px] md:text-[13px] bg-[#000000]/20 px-4 md:px-7 py-2.5 md:py-4"
                onClick={() => setShowSignIn(true)}
                text="Connexion"
                icon={LogIn}
              />
              <SignInModal
                isOpen={showSignIn}
                onClose={() => setShowSignIn(false)}
                onSwitchToSignUp={() => {
                  setShowSignIn(false);
                  setShowSignUp(true);
                }}
              />
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center w-screen px-4">
        <div>
          <SplitText
            text="Buildflow"
            className="text-5xl text-white sm:text-6xl md:text-8xl cursor-target font-mono text-center"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="words"
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
            className="text-lg text-white sm:text-xl md:text-2xl text-center font-script"
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
    </div>
  );
}
