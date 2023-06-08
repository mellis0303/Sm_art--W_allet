import { newProgramMap } from "@saberhq/anchor-contrib";
import type { AugmentedProvider, Provider } from "@saberhq/solana-contrib";
import {
  SolanaAugmentedProvider,
  TransactionEnvelope,
} from "@saberhq/solana-contrib";
import { u64 } from "@saberhq/token-utils";
import type { PublicKey, Signer } from "@solana/web3.js";
import { Keypair, SystemProgram } from "@solana/web3.js";
import BN from "bn.js";
import mapValues from "lodash.mapvalues";

import type { Programs } from "./constants";
import { COSMIC_ADDRESSES, COSMIC_IDLS } from "./constants";
import type { PendingSmallet } from "./wrappers/smallet";
import {
  findOwnerInvokerAddress,
  findSmallet,
  findSubaccountInfoAddress,
  findWalletDerivedAddress,
  SmalletWrapper,
} from "./wrappers/smallet";

/** Cosmic SDK */
export class CosmicSDK {
  constructor(
    readonly provider: AugmentedProvider,
    readonly programs: Programs
  ) {}
  /**
   * Creates a new instance of the SDK with the given keypair.
   */
  withSigner(signer: Signer): CosmicSDK {
    return CosmicSDK.load({
      provider: this.provider.withSigner(signer),
      addresses: mapValues(this.programs, (v) => v.programId),
    });
  }

  loadSmallet(key: PublicKey): Promise<SmalletWrapper> {
    return SmalletWrapper.load(this, key);
  }

  /**
   * Creates a subaccount info.
   */
  async createSubaccountInfo({
    smallet,
    index,
    type,
    payer = this.provider.wallet.publicKey,
  }: {
    smallet: PublicKey;
    index: number;
    type: "derived" | "ownerInvoker";
    payer?: PublicKey;
  }) {
    const [subaccount] =
      type === "derived"
        ? await findWalletDerivedAddress(smallet, index)
        : await findOwnerInvokerAddress(smallet, index);
    const [subaccountInfo, bump] = await findSubaccountInfoAddress(subaccount);
    return this.provider.newTX([
      this.programs.Smallet.instruction.createSubaccountInfo(
        bump,
        subaccount,
        smallet,
        new u64(index),
        {
          [type]: {},
        },
        {
          accounts: {
            subaccountInfo,
            payer,
            systemProgram: SystemProgram.programId,
          },
        }
      ),
    ]);
  }

  async newSmallet({
    owners,
    threshold,
    numOwners,
    base = Keypair.generate(),
    delay = new BN(0),
  }: {
    owners: PublicKey[];
    threshold: BN;
    numOwners: number;
    base?: Signer;
    /**
     * Timelock delay in seconds
     */
    delay?: BN;
  }): Promise<PendingSmallet> {
    const [smallet, bump] = await findSmallet(base.publicKey);

    const ix = this.programs.Smallet.instruction.createSmallet(
      bump,
      numOwners,
      owners,
      threshold,
      delay,
      {
        accounts: {
          base: base.publicKey,
          smallet,
          payer: this.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      }
    );

    return {
      smalletWrapper: new SmalletWrapper(this, {
        bump,
        key: smallet,
        base: base.publicKey,
      }),
      tx: new TransactionEnvelope(this.provider, [ix], [base]),
    };
  }

  static load({
    provider,
    addresses = COSMIC_ADDRESSES,
  }: {
    provider: Provider;
    // Addresses of each program.
    addresses?: { [K in keyof Programs]?: PublicKey };
  }): CosmicSDK {
    const allAddresses = { ...COSMIC_ADDRESSES, ...addresses };
    const programs = newProgramMap<Programs>(provider, COSMIC_IDLS, allAddresses);
    return new CosmicSDK(new SolanaAugmentedProvider(provider), programs);
  }
}
