import { prepareContractCall } from "thirdweb";
import { tokens } from "@/constants";
import getContract from "@/lib/get-contract";

type WrapOptions = {
	amount: bigint;
}

const WETH_CONTRACT = getContract({
	address: tokens['WETH'].address
});

export default function wrap(options: WrapOptions) {
	return prepareContractCall({
		contract: WETH_CONTRACT,
		method: "function deposit()",
		params: [],
		value: options.amount
	});
}

