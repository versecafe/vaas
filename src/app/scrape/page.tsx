"use client";

import { MultiStepLoader } from "@/components/multi-step-loader";
import { TokenForm } from "./form";
import { useEffect, useState } from "react";
import { Team, getVercelConfig } from "@/lib/vaas/vercel";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

const loadingStates = [
  {
    text: "Verifying Token",
  },
  {
    text: "Getting Teams",
  },
  {
    text: "Grabbing Projects",
  },
  {
    text: "Filtering For Analytics",
  },
];

export default function ScrapePage(): JSX.Element {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (token) {
      setLoading(true);
      (async () => {
        try {
          const { ok, error } = await getVercelConfig(token);
          if (error) {
            setLoading(false);
            toast({
              title: "Error",
              description: error,
              duration: 5000,
            });
          }
          await new Promise((resolve) => setTimeout(resolve, 1300));
          if (ok) {
            setTeams(ok);
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [token, toast]);

  return (
    <>
      {teams[0] != undefined ? (
        <div className="p-4 max-w-7xl flex-1 justify-center mx-auto relative z-10 w-full pt-20 sm:pt-0">
          <h2 className="text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-5">
            Available Projects
          </h2>
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-[600px] text-center mx-auto">
            Select a project to pull your analytics data from. You can alwaus
            come back and select a different project.
          </p>
          <ul className="pt-8">
            {teams.map((team) => (
              <li key={team.id}>
                <ul>
                  {team.projects.map((project) => (
                    <li
                      key={project.id}
                      className="text-2xl text-center font-normal text-neutral-200"
                    >
                      <Link href={`/scrape/${token}/${team.id}/${project.id}`}>
                        {project.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="max-w-96">
          <TokenForm onFormSubmit={setToken} />
        </div>
      )}
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={loading}
        duration={600}
      />
      {loading && (
        <button
          className="fixed top-4 right-4 text-white z-[120]"
          onClick={() => setLoading(false)}
        >
          X
        </button>
      )}
    </>
  );
}
