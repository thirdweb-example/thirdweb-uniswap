import { FACTORY_CONTRACT } from "@/constants";
import { bigIntMax, withTimeout } from "@/lib/utils";
import quote from "@/transactions/quote";
import Token from "@/types/token";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { simulateTransaction } from "thirdweb";
import { GetUniswapV3PoolResult, getUniswapV3Pool } from "thirdweb/extensions/uniswap";

const poolCache = new Map();

export default function useQuote({ tokenIn, amount, tokenOut }: { tokenIn?: Token, tokenOut?: Token, amount?: bigint }) {
    const [loading, setLoading] = useState(false);
    const [fee, setFee] = useState<number | undefined>();
    const [outputAmount, setOutputAmount] = useState<bigint | undefined>();

    useEffect(() => {
        const refreshQuote = async (tokenIn: Token, tokenOut: Token, amount: bigint) => {
            const loadingTimer = setTimeout(() => setLoading(true), 500); // wait to enter loading state to avoid flashing
            let pools;
            const key = `${tokenIn.address}:${tokenOut.address}`;
            if (poolCache.has(key)) {
                pools = poolCache.get(key);
            } else {
                pools = await getUniswapV3Pool({
                    contract: FACTORY_CONTRACT,
                    tokenA: tokenIn.address,
                    tokenB: tokenOut.address
                });
                poolCache.set(key, pools);
            }

            if (pools.length === 0) {
                toast.error("No path found for this token pair", { duration: 5000, id: "no-path" });
                return {}
            }

            const results: bigint[] = await Promise.all(pools.map(async (pool: GetUniswapV3PoolResult, i: number) => {
                const quoteTx = quote({
                    tokenIn: tokenIn,
                    tokenOut: tokenOut,
                    amount,
                    fee: pool.poolFee
                })

                try {
                    // if the simulation takes longer than 5 seconds, it's almost guaranteed to fail
                    return await simulateTransaction({ transaction: quoteTx });
                } catch (e) {

                }
            }));

            const expectedOutput = bigIntMax(...results);
            const bestPoolIdx = results.findIndex(a => a === expectedOutput);
            const bestFee = pools[bestPoolIdx].poolFee ?? BigInt(0);

            if (!expectedOutput || !bestFee) {
                toast.error("No path found for this token pair", { duration: 5000, id: "no-path" });
                return {}
            }

            clearTimeout(loadingTimer);
            return {
                expectedOutput,
                fee: pools[bestPoolIdx].poolFee ?? BigInt(0)
            };
        }


        const delayExecId = setTimeout(() => {
            if (tokenIn && tokenOut && amount) {
                refreshQuote(tokenIn, tokenOut, amount).then(({ expectedOutput, fee: bestFee }) => {
                    setFee(bestFee);
                    setOutputAmount(expectedOutput);
                }).finally(() => setLoading(false))
            } else {
                setFee(undefined);
                setOutputAmount(undefined);
            }
        }, 500);
        return () => clearTimeout(delayExecId);
    }, [tokenIn, amount, tokenOut]);

    return { loading, fee, outputAmount };
}