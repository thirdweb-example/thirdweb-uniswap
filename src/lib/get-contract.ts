import { Address, getContract as thirdwebGetContract, Chain } from "thirdweb";
import client from "@/lib/thirdweb-client";
import anvil from "@/lib/anvil";

type GetContractOptions = {
    address: Address;
    chain?: Chain
}

export default function getContract(options: GetContractOptions) {
    return thirdwebGetContract({
        client,
        chain: options.chain ?? anvil,
        address: options.address
    });
}

