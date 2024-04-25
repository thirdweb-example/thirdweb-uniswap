"use client"
import React, { ReactNode } from "react";
import { ThirdwebProvider } from "thirdweb/react";

export default function Thirdweb({ children }: { children: ReactNode }) {
    return <ThirdwebProvider>
        {children}
    </ThirdwebProvider>
}