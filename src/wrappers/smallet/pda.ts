import { utils } from "@project-serum/anchor";
import { getProgramAddress } from "@saberhq/solana-contrib";
import { u64 } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";

import { Cosmic_ADDRESSES } from "../../constants";

export const findSmallet = async (
  base: PublicKey
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [utils.bytes.utf8.encode("CosmicSmallet"), base.toBuffer()],
    Cosmic_ADDRESSES.smallet
  );
};

export const findTransactionAddress = async (
  smallet: PublicKey,
  index: number
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode("CosmicTransaction"),
      smallet.toBuffer(),
      new u64(index).toBuffer(),
    ],
    Cosmic_ADDRESSES.Smallet
  );
};

/**
 * Finds a derived address of a Smart Wallet.
 */
export const findWalletDerivedAddress = async (
  smallet: PublicKey,
  index: number
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode("CosmicSmalletDerived"),
      smallet.toBuffer(),
      new u64(index).toBuffer(),
    ],
    Cosmic_ADDRESSES.Smallet
  );
};

/**
 * Finds an Owner Invoker address of a Smart Wallet.
 */
export const findOwnerInvokerAddress = async (
  smallet: PublicKey,
  index: number
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode("CosmicSmalletOwnerInvoker"),
      smallet.toBuffer(),
      new u64(index).toBuffer(),
    ],
    COSMIC_ADDRESSES.Smallet
  );
};

/**
 * Finds the subaccount info address of a subaccount of a smart wallet.
 */
export const findSubaccountInfoAddress = async (
  subaccount: PublicKey
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [utils.bytes.utf8.encode("CosmicSubaccountInfo"), subaccount.toBuffer()],
    COSMIC_ADDRESSES.Smallet
  );
};

export const getSmalletAddress = (base: PublicKey): PublicKey => {
  return getProgramAddress(
    [utils.bytes.utf8.encode("CosmicSmallet"), base.toBuffer()],
    COSMIC_ADDRESSES.Smallet
  );
};

export const getTransactionAddress = (
  smallet: PublicKey,
  index: number
): PublicKey => {
  return getProgramAddress(
    [
      utils.bytes.utf8.encode("CosmicTransaction"),
      smallet.toBuffer(),
      new u64(index).toBuffer(),
    ],
    COSMIC_ADDRESSES.Smallet
  );
};

/**
 * Finds a derived address of a Smart Wallet.
 */
export const getWalletDerivedAddress = (
  smallet: PublicKey,
  index: number
): PublicKey => {
  return getProgramAddress(
    [
      utils.bytes.utf8.encode("CosmicSmalletDerived"),
      smallet.toBuffer(),
      new u64(index).toBuffer(),
    ],
    COSMIC_ADDRESSES.Smallet
  );
};

/**
 * Finds an Owner Invoker address of a Smart Wallet.
 */
export const getOwnerInvokerAddress = (
  smallet: PublicKey,
  index: number
): PublicKey => {
  return getProgramAddress(
    [
      utils.bytes.utf8.encode("CosmicSmalletOwnerInvoker"),
      smallet.toBuffer(),
      new u64(index).toBuffer(),
    ],
    COSMIC_ADDRESSES.Smallet
  );
};

/**
 * Finds the subaccount info address of a subaccount of a smart wallet.
 */
export const getSubaccountInfoAddress = (subaccount: PublicKey): PublicKey => {
  return getProgramAddress(
    [utils.bytes.utf8.encode("CosmicSubaccountInfo"), subaccount.toBuffer()],
    COSMIC_ADDRESSES.Smallet
  );
};
