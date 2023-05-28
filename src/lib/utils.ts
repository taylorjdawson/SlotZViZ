import { BUILDER_PUBKEY_IDS } from "./constants"
import { Bid, BlockBid } from "./types"
import ColorHash from "color-hash"
import { v4 as uuid } from "uuid"
import type { Address } from "viem"
const convertBlockBidToBid =
  (url: string): ((blockBid: BlockBid) => Bid) =>
  (blockBid: BlockBid): Bid => ({
    builderPubKey: blockBid.builder_pubkey,
    builderLabel: BUILDER_PUBKEY_IDS?.[blockBid.builder_pubkey] ?? "",
    timestamp: blockBid.timestamp_ms,
    value: blockBid.value,
    relay: new URL(url).hostname.split(".")[1],
  })
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

/**
 * 
 [
  {
    "slot": "6516479",
    "parent_hash": "0x5ddeb7db8baa246bf9ea1a52da10e4de2be12b7a630b864885e3888f66c1d6bb",
    "block_hash": "0xae728a9a7d0b9341844f5d212a1a26617d36596ed37f0d250d99c431accc1ea8",
    "builder_pubkey": "0xa21a2f4807a2bcb6b07c10cea241322e0910c30869c1e4eda686b0d69bdcb74d2a140ef994afcf0bb38e0b960df4d2ee",
    "proposer_pubkey": "0xb4e8c3763ce01b98c8a0b3e75015c8a1be7dca3535048c20cf66f65c353d9df7ae094423174eeba847ed4ce54bbc0cf3",
    "proposer_fee_recipient": "0x388c818ca8b9251b393131c08a736a67ccb19297",
    "gas_limit": "30000000",
    "gas_used": "14433736",
    "value": "93419853708036150",
    "block_number": "17336494",
    "num_tx": "167"
  }
]
 */

export const getBlockBids = async (slotNumber: string) => {
  const relayUrls = [
    "https://builder-relay-mainnet.blocknative.com/relay/v1/data/bidtraces/builder_blocks_received",
    "https://boost-relay.flashbots.net/relay/v1/data/bidtraces/builder_blocks_received",
    "https://relay.ultrasound.money/relay/v1/data/bidtraces/builder_blocks_received",
  ]

  const data: Bid[] = (
    await Promise.all(
      relayUrls.map((url) =>
        fetch(`${url}?slot=${slotNumber}`).then((res) =>
          res.json().then((bids) => bids.map(convertBlockBidToBid(url)))
        )
      )
    )
  ).flat()

  return data
}

const _colorHash = new ColorHash({
  saturation: [0.6, 0.7, 0.8, 0.9, 1],
})

export const colorHash = (str: string) => _colorHash.hex(str)
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
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }

  let r = (hash & 0xff0000) >> 16
  let g = (hash & 0x00ff00) >> 8
  let b = hash & 0x0000ff

  // Calculate the perceived luminance of the color
  let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // If the color is too dark, brighten it by adding an offset
  if (luminance < 0.5) {
    r = (r + 127) % 255
    g = (g + 127) % 255
    b = (b + 127) % 255
  }

  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  )
}

export const getNonce = () => uuid()

export const createMessageToSign = ({
  nonce,
  address,
}: {
  nonce: string
  address: Address
}) =>
  `With reverence, I ${address.slice(
    0,
    10
  )} as a vigilant Observer of the Sacred Slots, inscribe my vow, a pledge etched in the immutable ledger of time, an unbreakable thread in the vast tapestry of our collective transhuman existence...\n\n|⟐| The Council of Slot Observers |⟐|\n\n${nonce}`

export const toggleCase = <T>(obj: Record<keyof T, T[keyof T]>) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const snakeCase = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      )
      const camelCase = key.replace(/_[a-z]/g, (match) =>
        match.slice(1).toUpperCase()
      )
      const newKey = snakeCase === key ? camelCase : snakeCase
      return [newKey, value]
    })
  )
