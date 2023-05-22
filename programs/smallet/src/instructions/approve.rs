use crate::*;

pub fn handler(ctx: Context<Approve>) -> Result<()> {
    let owner_index = ctx
        .accounts
        .smallet
        .try_owner_index(ctx.accounts.owner.key())?;
    ctx.accounts.transaction.signers[owner_index] = true;

    emit!(TransactionApproveEvent {
        smallet: ctx.accounts.smallet.key(),
        transaction: ctx.accounts.transaction.key(),
        owner: ctx.accounts.owner.key(),
        timestamp: Clock::get()?.unix_timestamp
    });
    Ok(())
}

impl<'info> Validate<'info> for Approve<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.smallet, self.transaction.smallet);

        invariant!(
            self.smallet.owner_set_seqno == self.transaction.owner_set_seqno,
            OwnerSetChanged
        );

        invariant!(self.transaction.executed_at == -1, AlreadyExecuted);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Approve<'info> {
    pub smallet: Account<'info, Smallet>,
    #[account(mut, has_one = smallet)]
    pub transaction: Account<'info, Transaction>,
    pub owner: Signer<'info>,
}
