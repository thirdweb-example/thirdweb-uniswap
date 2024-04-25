"use client";
import React, { useState } from "react";
import { prepareContractCall, toWei } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import TransactionButton from "@/components/TransactionButton";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { tokens } from "@/constants";
import getContract from "@/lib/get-contract";

const WETH_CONTRACT = getContract({
    address: tokens["weth"].address
})

export default function Wrapper() {
    const account = useActiveAccount();
    const [amount, setAmount] = useState<number>(0);
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="h-full rounded-xl" disabled={!account} variant="outline">Wrap ETH</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle>Wrap ETH</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Input placeholder="0" type="number" onChange={(e) => setAmount(parseFloat(e.target.value))} />
                            ETH
                        </div>
                        <div className="mt-4 w-full">
                            <TransactionButton
                                transaction={() => {
                                    const tx = prepareContractCall({
                                        contract: WETH_CONTRACT,
                                        method: "function deposit()",
                                        params: [],
                                        value: toWei(amount.toString())
                                    })
                                    return tx;
                                }}
                                onSent="Wrapping your ETH..."
                                onConfirmed="Successfully wrapped ETH"
                                onError="Failed to wrap your ETH"
                                successCallback={() => setAmount(0)}
                            >
                                Wrap
                            </TransactionButton>
                        </div>
                    </CardContent>
                </Card>
            </PopoverContent>
        </Popover>
    )
}

