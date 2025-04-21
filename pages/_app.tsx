import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import UnauthenticatedDashboard from "@/components/UnauthenticatedDashboard";
import { appearance } from "@/data/clerkAppearance";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider appearance={appearance}>
      <SignedOut>
        <UnauthenticatedDashboard />
      </SignedOut>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
