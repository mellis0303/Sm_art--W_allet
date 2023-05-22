import type { TransactionEnvelope } from "@saberhq/solana-contrib";
import type { PublicKey, TransactionInstruction } from "@solana/web3.js";
import type BN from "bn.js";

import type { SmalletData } from "../../programs";
import type { SmalletWrapper } from "./index";

export type InitSmalletWrapperArgs = {
  readonly bump: number;
  readonly base: PublicKey;
  readonly key: PublicKey;
  readonly data?: SmalletData;
};

export type PendingSmallet = {
  readonly smalletWrapper: SmalletWrapper;
  readonly tx: TransactionEnvelope;
};

export type PendingSmalletTransaction = {
  /**
   * Pubkey of the created transaction.
   */
  readonly transactionKey: PublicKey;
  /**
   * Transaction to create the transaction.
   */
  readonly tx: TransactionEnvelope;
  /**
   * Index of the transaction.
   */
  readonly index: number;
};

export interface NewTransactionArgs {
  readonly proposer?: PublicKey;
  /**
   * Payer of the created transaction.
   */
  readonly payer?: PublicKey;
  /**
   * Instructions which compose the new transaction.
   */
  readonly instructions: TransactionInstruction[];
  /**
   * ETA of the new transaction.
   */
  readonly eta?: BN;
}
