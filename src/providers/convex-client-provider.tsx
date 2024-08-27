"use client";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={`${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}`}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
      </ConvexProviderWithClerk>
    </ClerkProvider> 
  
)
}
