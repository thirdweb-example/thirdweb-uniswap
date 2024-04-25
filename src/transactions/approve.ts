import { Address } from "thirdweb";
import Token from "@/types/token";
import getContract from "@/lib/get-contract";
import { approve as thirdwebApprove } from "thirdweb/extensions/erc20";

type ApproveOptions = {
	token: Token,
	amount: bigint,
	spender: Address
}

export default function approve(options: ApproveOptions) {
	const contract = getContract({
		address: options.token.address
	});

	return thirdwebApprove({
		contract,
		spender: options.spender,
		amountWei: options.amount
	});
}

