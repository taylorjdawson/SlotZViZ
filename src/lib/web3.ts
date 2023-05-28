import {
  Address,
  Hash,
  createPublicClient,
  http,
  recoverMessageAddress,
} from "viem";
import { mainnet } from "viem/chains";

const ethClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

/**
 *
 * @param address The address that signed the message
 * @param message The plaintext message used for verification
 * @param signature The signature of the `message`
 * @returns
 */
export const getVerifiedAddress = async (
  address: Address,
  message: string, //`nonce: ${string}`,
  signature: Hash
) =>
  (await ethClient.verifyMessage({
    address,
    message,
    signature,
  }))
    ? await recoverMessageAddress({
        message,
        signature,
      })
    : false;
