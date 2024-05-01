import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function Home() {

  const { userId } : { userId: string | null } = auth();
  

  return (
    
    <div className="w-screen min-h-screen bg-gradient-to-r from-sky-100 to-rose-100 dark:bg-gradient-to-r dark:from-slate-800 dark:to-gray-800">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
        </div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">PDF Analyzer</h1>
            <UserButton afterSignOutUrl="/"/>
          </div>

          <div className="flex mt-3">
            {userId && <Button>Go to Files</Button>}
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-700 dark:text-slate-200">
            {!userId && <p>Leverage AI to extract insights from your PDFs</p>}
          </p>

          <div className="w-full mt-4">
            {userId ?
            (
              <FileUpload />
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
