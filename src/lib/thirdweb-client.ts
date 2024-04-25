import { createThirdwebClient } from "thirdweb";

export default createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
});

