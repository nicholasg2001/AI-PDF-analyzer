import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function Home() {

  const { userId } : { userId: string | null } = auth();


  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-red-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">PDF Analyzer</h1>
            <UserButton afterSignOutUrl="/"/>
          </div>

          <div className="flex mt-2">
            {userId && <Button>Go to Files</Button>}
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-700">
            Join today to leverage AI to extract insights from your PDFs
          </p>

          <div className="w-full mt-4">
            {userId ?
             (
              <h1>fileupload</h1>
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2"/>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
