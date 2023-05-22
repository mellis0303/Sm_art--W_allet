
#![deny(missing_docs)]

use anchor_lang::prelude::*;
use anchor_lang::solana_program;
use vipers::prelude::*;


#[account]
#[derive(Default, Debug, PartialEq)]
pub struct Smallet {

    pub base: Pubkey,

    pub bump: u8,


    pub threshold: u64,

    pub minimum_delay: i64,

    pub grace_period: i64,

    pub owner_set_seqno: u32,

    pub num_transactions: u64,

    pub owners: Vec<Pubkey>,

    pub reserved: [u64; 16],
}

impl Smallet {
    pub fn space(max_owners: u8) -> usize {
        4 
            + std::mem::size_of::<Smallet>()
            + 4 
            + std::mem::size_of::<Pubkey>() * (max_owners as usize)
    }

    pub fn owner_index_opt(&self, key: Pubkey) -> Option<usize> {
        self.owners.iter().position(|a| *a == key)
    }


    pub fn try_owner_index(&self, key: Pubkey) -> Result<usize> {
        Ok(unwrap_opt!(self.owner_index_opt(key), InvalidOwner))
    }
}



#[account]
#[derive(Debug, Default, PartialEq)]
pub struct Transaction {

    pub smallet: Pubkey,

    pub index: u64,

    pub bump: u8,


    pub proposer: Pubkey,

    pub instructions: Vec<TXInstruction>,

    pub signers: Vec<bool>,

    pub owner_set_seqno: u32,

    pub eta: i64,

    pub executor: Pubkey,
    pub executed_at: i64,
}

impl Transaction {
    pub fn space(instructions: Vec<TXInstruction>) -> usize {
        4  
            + std::mem::size_of::<Transaction>()
            + 4 
            + (instructions.iter().map(|ix| ix.space()).sum::<usize>())
    }

    pub fn num_signers(&self) -> usize {
        self.signers.iter().filter(|&did_sign| *did_sign).count()
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, Default, PartialEq)]
pub struct TXInstruction {
    pub program_id: Pubkey,
    pub keys: Vec<TXAccountMeta>,
    pub data: Vec<u8>,
}

impl TXInstruction {
    pub fn space(&self) -> usize {
        std::mem::size_of::<Pubkey>()
            + (self.keys.len() as usize) * std::mem::size_of::<TXAccountMeta>()
            + (self.data.len() as usize)
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, PartialEq, Copy, Clone)]
pub struct TXAccountMeta {
    pub pubkey: Pubkey,
    pub is_signer: bool,
    pub is_writable: bool,
}

impl From<&TXInstruction> for solana_program::instruction::Instruction {
    fn from(tx: &TXInstruction) -> solana_program::instruction::Instruction {
        solana_program::instruction::Instruction {
            program_id: tx.program_id,
            accounts: tx.keys.clone().into_iter().map(Into::into).collect(),
            data: tx.data.clone(),
        }
    }
}

impl From<TXAccountMeta> for solana_program::instruction::AccountMeta {
    fn from(
        TXAccountMeta {
            pubkey,
            is_signer,
            is_writable,
        }: TXAccountMeta,
    ) -> solana_program::instruction::AccountMeta {
        solana_program::instruction::AccountMeta {
            pubkey,
            is_signer,
            is_writable,
        }
    }
}

#[derive(
    AnchorSerialize, AnchorDeserialize, Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord,
)]
#[repr(u8)]
pub enum SubaccountType {
    Derived = 0,
    OwnerInvoker = 1,
}

impl Default for SubaccountType {
    fn default() -> Self {
        SubaccountType::Derived
    }
}

#[account]
#[derive(Copy, Default, Debug, PartialEq, Eq)]
pub struct SubaccountInfo {
    pub smallet: Pubkey,
    pub subaccount_type: SubaccountType,
    pub index: u64,
}

impl SubaccountInfo {
    pub const LEN: usize = 32 + 1 + 8;
}
