import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "../ui/button";

export default function Header() {
  const isLoggedIn = false;
    return <nav className="container flex items-center justify-between py-4 lg:py-8 px-2 mx-auto">
      <div className="flex lg:flex-1">
      <Link href="/" className="flex items-center gap-1 lg:gap-2 shrink-0">
        <FileText className="w-5 h-5 lg:w-8 lg:h-8 text-gray-900 hover:rotate-12 transform transition duration-200 ease-in-out "/>
        <span className="font-extrabold lg:text-xl text-gray-900">Sommaire</span>
        </Link>
        </div>
        <div className="flex lg:justify-center gap-4 lg:gap-12 lg:items-center">
          <Link href="/#pricing">Pricing</Link> 
         {isLoggedIn && <Link href="/dashboard">Your Summaries</Link>}
        </div>
        <div className="flex lg:justify-end lg:flex-1 ">
          {isLoggedIn? (
          <div className="flex gap-2 items-center">
            <Link href="upload ">Uplaod a PDF</Link>
            <div>Pro</div>
            <Button>user</Button >
          </div>
          ):(  
          <div> 
          <Link href="/#sign-in ">Sign in</Link>
          </div>
          )}
        </div>
    </nav>
  }; 
   