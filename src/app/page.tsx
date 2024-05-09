import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from 'next/image'
import Link from "next/link";
import Scanner from "/public/scanner.png";
import Robot from "/public/robot.png";

export default function Home() {
  const { userId }: { userId: string | null } = auth();

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-sky-100 to-rose-100 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700">
      <div className="fixed top-4 right-4">
        <UserButton afterSignOutUrl="/"/>
      </div>
      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-center h-screen">
        <div className="flex flex-col items-center text-center md:items-center md:ml-36">
          <h1 className="mr-3 text-7xl md:whitespace-nowrap font-semibold">PDF Analyzer</h1>
          <div className="flex mt-3">
            {userId && <Button className="h-12 text-xl font-semibold">Go to Files</Button>}
          </div>
          <p className="max-w-xl mt-1 text-2xl text-slate-700 dark:text-slate-200">
            {!userId && <span>Leverage AI to extract insights from your PDFs</span>}
          </p>
          <div className="max-w-full flex mt-4">
            {userId ? (
              <FileUpload />
            ) : (
                <Link className="items-center" href="/sign-in">
                  <Button className="h-12 text-xl font-semibold">
                    Login to get Started!
                    <LogIn className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
            )}
          </div>
        </div>
        <div className="hidden flex-shrink-0 ml-8 md:block">
          {userId ? (
            <Image src={Scanner} width={1000} height={1000} alt="Scanner" />
          ) : (
            <Image className="mr-48" src={Robot} width={500} height={500} alt="Robot" />
          )}
        </div>
      </div>
    </div>
  );
}