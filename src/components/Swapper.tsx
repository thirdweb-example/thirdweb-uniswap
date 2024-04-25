"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "./ui/input";
import { Address, toTokens, toUnits, toWei } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import approve from "@/transactions/approve";
import swap from "@/transactions/swap";
import { ROUTER, tokens } from "@/constants";
import TransactionButton from "./TransactionButton";
import TokenSelect from "./TokenSelect";
import Token from "@/types/token";
import useQuote from "@/hooks/useQuote";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { allowance as thirdwebAllowance, balanceOf } from "thirdweb/extensions/erc20";
import getContract from "@/lib/get-contract";

const fetchAllowance = async (tokenIn: Token, recipient: Address) => {
    return thirdwebAllowance({ contract: getContract({ address: tokenIn.address }), owner: recipient, spender: ROUTER });
}

const fetchBalance = async (tokenIn: Token, recipient: Address) => {
    return balanceOf({ contract: getContract({ address: tokenIn.address }), address: recipient });
}


function SwapButton({ tokenIn, tokenOut, amount, fee, recipient }: { tokenIn: Token, tokenOut: Token, amount: bigint, fee: number, recipient: Address }) {
    const [allowance, setAllowance] = useState(BigInt(0));
    const [balance, setBalance] = useState(BigInt(0));

    const refetchAllowance = useCallback(() => fetchAllowance(tokenIn, recipient).then(setAllowance), [tokenIn, recipient]);
    const refetchBalance = useCallback(() => fetchBalance(tokenIn, recipient).then(setBalance), [tokenIn, recipient]);
    useEffect(() => {
        const timeout = setTimeout(() => {
            refetchAllowance();
            refetchBalance()
        }, 500)
        return () => clearTimeout(timeout);
    }, [tokenIn, tokenOut, amount, recipient]);

    if (balance < amount) {
        return <div className="flex flex-col text-center">
            <div className="font-semibold text-red-500">Not enough {tokenIn.symbol}!</div>
            <div className="text-sm text-gray-400">Your balance: {toTokens(balance, tokenIn.decimals)}</div>
        </div>
    }

    if (allowance < amount) {
        return (
            <TransactionButton
                transaction={() => {
                    return approve({
                        token: tokenIn,
                        amount: amount,
                        spender: ROUTER
                    })
                }}
                onSent="Approve your tokens for use..."
                onConfirmed="Tokens successfully approved for use."
                onError="Failed to approve tokens!"
                successCallback={refetchAllowance}
            >
                Approve
            </TransactionButton>
        )
    }

    return (
        <TransactionButton
            transaction={async () => {
                return swap({
                    inputToken: tokenIn,
                    inputAmount: amount,
                    outputToken: tokenOut,
                    recipient: recipient,
                    fee
                });
            }}
            onSent="Swap submitted..."
            onConfirmed="Successfully swapped."
            onError="Failed to complete swap."
            successCallback={refetchBalance}
        >
            Swap
        </TransactionButton>
    )
}

export default function Swapper() {
    const account = useActiveAccount();
    const [amount, setAmount] = useState<number>(0);
    const [inputTokenKey, setInputTokenKey] = useState<string | undefined>();
    const [outputTokenKey, setOutputTokenKey] = useState<string | undefined>();

    const inputToken = useMemo(() => inputTokenKey ? tokens[inputTokenKey] : undefined, [inputTokenKey]);
    const outputToken = useMemo(() => outputTokenKey ? tokens[outputTokenKey] : undefined, [outputTokenKey]);
    const { loading: quoteLoading, fee, outputAmount } = useQuote({ tokenIn: inputToken, tokenOut: outputToken, amount: toUnits(amount.toString(), inputToken?.decimals ?? 18) });

    const canSwap = !quoteLoading && account && inputToken && outputToken && amount && fee;

    return <Card className="">
        <CardHeader>
            <CardTitle>Swap</CardTitle>
        </CardHeader>
        <CardContent className="">
            <div className="flex w-[400px] flex-col items-center gap-4">
                <div className="flex w-full items-center gap-2">
                    <Input placeholder="0" type="number" onChange={(e) => setAmount(parseFloat(e.target.value || "0"))} className="w-full" /><TokenSelect selectedKey={inputTokenKey} onSelect={setInputTokenKey} />
                </div>
                <div className={cn("flex items-center w-full gap-2", quoteLoading && "animate-pulse")}>
                    <div className="w-full text-slate-600 mx-3 relative h-8">
                        {quoteLoading ? <div className="flex h-full items-center absolute left-0"><Loader2Icon className="animate-spin w-4 h-4" /></div> :
                            <div>{outputAmount && outputToken ? toTokens(outputAmount, outputToken.decimals) : 0}</div>
                        }
                    </div>
                    <TokenSelect selectedKey={outputTokenKey} onSelect={setOutputTokenKey} />
                </div>
            </div>
            <div className="mt-4 w-full">
                {canSwap ? <SwapButton fee={fee} recipient={account.address as Address} tokenIn={inputToken} tokenOut={outputToken} amount={toUnits(amount.toString(), inputToken?.decimals ?? 18)} /> : <></>}
            </div>
        </CardContent>
    </Card>
}
