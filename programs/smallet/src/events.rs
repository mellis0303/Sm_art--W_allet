#![allow(missing_docs)]

use crate::*;

#[event]
pub struct WalletCreateEvent {
    #[index]
    pub smallet: Pubkey,
    pub owners: Vec<Pubkey>,
    pub threshold: u64,
    pub minimum_delay: i64,
    pub timestamp: i64,
}

#[event]
pub struct WalletSetOwnersEvent {
    #[index]
    pub smallet: Pubkey,
    pub owners: Vec<Pubkey>,
    pub timestamp: i64,
}

#[event]
pub struct WalletChangeThresholdEvent {
    #[index]
    pub smallet: Pubkey,
    pub threshold: u64,
    pub timestamp: i64,
}

#[event]
pub struct TransactionCreateEvent {
    #[index]
    pub smallet: Pubkey,
    #[index]
    pub transaction: Pubkey,
    pub proposer: Pubkey,
    pub instructions: Vec<TXInstruction>,
    pub eta: i64,
    pub timestamp: i64,
}

#[event]
pub struct TransactionApproveEvent {
    #[index]
    pub smallet: Pubkey,
    #[index]
    pub transaction: Pubkey,
    pub owner: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct TransactionUnapproveEvent {
    #[index]
    pub smallet: Pubkey,
    #[index]
    pub transaction: Pubkey,
    pub owner: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct TransactionExecuteEvent {
    #[index]
    pub smallet: Pubkey,
    #[index]
    pub transaction: Pubkey,
    pub executor: Pubkey,
    pub timestamp: i64,
}
