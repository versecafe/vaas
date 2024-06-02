import { ShinyButton } from "@/components/shiny-button";
import { Spotlight } from "@/components/spotlight";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <Spotlight
        className="md:top-[-10vh] lg:top-[-10vh] xl:top-[-12vh] lg:left-[23vw] top-[-10vh] left-[5vw] hidden sm:block"
        fill="white"
      />
      <div className=" p-4 max-w-7xl flex-1 justify-center mx-auto relative z-10 w-full pt-20 sm:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          VAAS <br /> We have a cool acronym
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Pulling your analytics data from Vercel for use in internal tools has
          never been easier.
        </p>
        <div className="flex justify-center pt-8">
          <Link href="/analytics">
            <ShinyButton>Start now</ShinyButton>
          </Link>
        </div>
      </div>
    </>
  );
}
