import { ReactNode } from "react";

import Image from "next/image";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main suppressHydrationWarning>
      <div className="relative container h-screen bg-bg flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="bg-bg relative hidden  h-full flex-col p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-[#cbd5df] rounded-br-[55px]" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Image
              width={450}
              height={450}
              src="/assets/logo/abwabdigital-logo.png"
              alt="Abwab Digital Logo"
              className="mr-2  object-cover"
              priority
            />
          </div>
          <div className="relative z-20 mt-auto text-accent-foreground">
            <blockquote className="space-y-2">
              <p className="text-lg">
                Abwab Digital is a successful company specializing in mobile app
                and website development, as well as marketing services.
                We&apos;ve excelled in various industries including restaurants,
                healthcare, education, and Ecommerce.
              </p>
              <footer className="text-sm">
                <cite className="font-semibold">Abwab Digital</cite>
                <span className="text-muted-foreground">, CEO</span>
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="flex h-full lg:p-8">{children}</div>
      </div>
    </main>
  );
}
