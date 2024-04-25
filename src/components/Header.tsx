"use client";
import React from "react";
import ConnectButton from "./ConnectButton";
import Wrapper from "./Wrapper";
import Image from "next/image";

export default function Header() {
    return (
        <header className="flex p-4 max-w-7xl mx-auto justify-between w-full">
            <div className="flex gap-2 items-center"><Image src="/thirdweb.png" alt="" width={300} height={300} className="w-10 h-10" /><h1 className="text-2xl font-bold">TokenSwap</h1></div>
            <div className="flex gap-2 items-stretch">
                <Wrapper />
                <ConnectButton />
            </div>
        </header>
    )
}