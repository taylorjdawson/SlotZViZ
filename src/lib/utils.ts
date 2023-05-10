import { BlockBid } from "./types";

export const getBlockBids = async (slotNumber: string) => {
  const relayUrls = [
    "https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/builder_blocks_received",
    "https://boost-relay.flashbots.net/relay/v1/data/bidtraces/builder_blocks_received",
    "https://relay.ultrasound.money/relay/v1/data/bidtraces/builder_blocks_received",
  ];

  const data: BlockBid[] = await Promise.all(
    relayUrls.map((url) =>
      fetch(`${url}?slot=${slotNumber}`).then((res) => res.json())
    )
  );

  return data.flat();
};
