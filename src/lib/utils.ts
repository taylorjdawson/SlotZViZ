import { BUILDER_PUBKEY_IDS } from "./constants";
import { Bid, BlockBid } from "./types";
import ColorHash from "color-hash";

const convertBlockBidToBid =
  (url: string): ((blockBid: BlockBid) => Bid) =>
  (blockBid: BlockBid): Bid => ({
    builderPubKey: blockBid.builder_pubkey,
    builderLabel: BUILDER_PUBKEY_IDS?.[blockBid.builder_pubkey] ?? "",
    timestamp: blockBid.timestamp_ms,
    value: blockBid.value,
    relay: new URL(url).hostname.split(".")[1],
  });
// function isEqual(a: BlockBid, b: BlockBid): boolean {
//   return (
//     a.slot === b.slot &&
//     a.block_hash === b.block_hash &&
//     a.builder_pubkey === b.builder_pubkey &&
//     a.value === b.value &&
//     a.timestamp === b.timestamp
//   );
// }

// function findDuplicates(blockBids: BlockBid[]): void {
//   for (let i = 0; i < blockBids.length; i++) {
//     for (let j = i + 1; j < blockBids.length; j++) {
//       if (isEqual(blockBids[i], blockBids[j])) {
//         console.log(
//           `Duplicate found: ${blockBids[i].relay} ${blockBids[j].relay}`
//         );
//       }
//     }
//   }
// }

export const getBlockBids = async (slotNumber: string) => {
  const relayUrls = [
    "https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/builder_blocks_received",
    "https://boost-relay.flashbots.net/relay/v1/data/bidtraces/builder_blocks_received",
    "https://relay.ultrasound.money/relay/v1/data/bidtraces/builder_blocks_received",
  ];

  const data: Bid[] = (
    await Promise.all(
      relayUrls.map((url) =>
        fetch(`${url}?slot=${slotNumber}`).then((res) =>
          res.json().then((bids) => bids.map(convertBlockBidToBid(url)))
        )
      )
    )
  ).flat();

  return data;
};

const _colorHash = new ColorHash({
  saturation: [0.6, 0.7, 0.8, 0.9, 1],
});

export const colorHash = (str: string) => _colorHash.hex(str);
// {
//   let hash = 0;
//   for (let i = 0; i < str?.length; i++) {
//     hash = str.charCodeAt(i) + ((hash << 5) - hash);
//   }

//   let color = "#";
//   for (let i = 0; i < 3; i++) {
//     // Shift the color range to produce lighter colors
//     const value = ((hash >> (i * 8)) & 0xff) + 127;
//     color += ("00" + value.toString(16)).substr(-2);
//   }
//   return color;
// };
function generateColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  let r = (hash & 0xff0000) >> 16;
  let g = (hash & 0x00ff00) >> 8;
  let b = hash & 0x0000ff;

  // Calculate the perceived luminance of the color
  let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // If the color is too dark, brighten it by adding an offset
  if (luminance < 0.5) {
    r = (r + 127) % 255;
    g = (g + 127) % 255;
    b = (b + 127) % 255;
  }

  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}
