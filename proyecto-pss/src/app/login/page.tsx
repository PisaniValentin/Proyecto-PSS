'use client';

import Link from "next/link";
import Google from "../ui/Icons/googleIcon";
import Facebook from "../ui/Icons/facebookIcon";
import Apple from "../ui/Icons/appleIcon";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsPending(false);

    if (res?.error) {
      setErrorMessage("Invalid credentials.");
    } else if (res?.ok) {
      router.refresh();
      router.push(res.url || "/");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center h-max">
      <div className="p-10 flex flex-col gap-1">
        <h1 className="font-bold bg-[linear-gradient(90deg,_#14A9FE,_#B83DD6)] bg-clip-text text-transparent text-4xl self-center">Sign In</h1>
        <h2 className="text-gray-300 text-xl self-center mb-4">Hi! Welcome, you've been missed</h2>
        <label className="text-md font-bold" htmlFor="email">Email: </label>
        <div className="border-gradient input-border mb-4">
          <input className="border-gradient-body w-full p-1 pl-4" name="email" type="email" id="email" placeholder="something@gmail.com" />
        </div>
        <label className="text-md font-bold" htmlFor="password">Password: </label>
        <div className="input-border mb-4 border-gradient">
          <input className="border-gradient-body w-full p-1 pl-4" name="password" type="password" id="password" placeholder="Password" />
        </div>

        <button className="border-gradient w-1/2 text-center self-center mb-4" aria-disabled={isPending}>
          <div className="border-gradient-body">
            Log in
          </div>
        </button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <div className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>

        <h3 className="self-center text-gray-400 mb-4">Or sign in with</h3>
        <ul className="flex justify-around mb-10">
          <li>
            <a href="">
              <Google width={56} height={56} />
            </a>
          </li>
          <li>
            <a href="">
              <Facebook width={56} height={56} />
            </a>
          </li>
          <li>
            <a href="">
              <Apple width={56} height={56} />
            </a>
          </li>
        </ul>
        <h5 className="text-gray-300 text-center">
          Don't have an account?
          <Link href={""} className="pl-2 text-white underline">Sign Up</Link>
        </h5>
      </div>
    </form>
  );
}