export interface BlockBid {
  slot: string;
  parent_hash: string;
  block_hash: string;
  builder_pubkey: string;
  proposer_pubkey: string;
  proposer_fee_recipient: string;
  gas_limit: string;
  gas_used: string;
  value: string;
  num_tx: string;
  block_number: string;
  timestamp: string;
  timestamp_ms: string;
}

export interface Bid {
  relay: string;
  builderPubKey: string;
  builderLabel: string;
  timestamp: string;
  value: string;
}

export type Bids = {
  [key: string]: Bid[];
};

