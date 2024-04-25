import { QUOTER } from "@/constants"
import getContract from "@/lib/get-contract"
import Token from "@/types/token"
import { quoteExactInputSingle } from "thirdweb/extensions/uniswap"

const QUOTER_CONTRACT = getContract({ address: QUOTER })

type QuoteOptions = {
    tokenIn: Token,
    amount: bigint,
    tokenOut: Token,
    fee: number,
}

export default function quote(options: QuoteOptions) {
    return quoteExactInputSingle({
        contract: QUOTER_CONTRACT,
        tokenIn: options.tokenIn.address,
        amountIn: options.amount,
        tokenOut: options.tokenOut.address,
        fee: options.fee,
        sqrtPriceLimitX96: BigInt(0),
    })
}