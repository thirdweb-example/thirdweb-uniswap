"use client";
import React from "react";
import { ConnectButton as ThirdwebConnectButton, useActiveWalletChain } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import client from "@/lib/thirdweb-client";
import anvil from "@/lib/anvil";

export default function ConnectButton() {
    const wallets = [
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("me.rainbow"),
    ];

    return (
        <ThirdwebConnectButton connectButton={{ className: "w-full" }} theme="light" chain={anvil} client={client} wallets={wallets} />
    )
}