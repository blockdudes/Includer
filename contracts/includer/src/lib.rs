#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, token, vec,
    xdr::{ScErrorCode, ScErrorType},
    Address, ConversionError, Env, IntoVal, String, TryFromVal, Val, Vec,
};

#[contract]
pub struct IncluderContract;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    InsufficientBalance = 1,
    InsufficientLiquidity = 2,
    Unauthorized = 3,
    UnmatchedToken = 4,
    TokenNotFound = 5,
    InsufficientDepositBalance = 6,
    AlreadyBorrowToken = 7,
    MaximumBorrowExceed = 8,
    BorrowBalanceError = 9,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct UserInfo {
    total_deposit_balance: i128,
    last_deposit_time: u64,
    borrow_balance: i128,
    borrow_timestamp: u64,
}

#[contractimpl]
impl IncluderContract {
    const DAILY_INTEREST_RATE: i128 = 5;
    const SECONDS_IN_A_DAY: u64 = 86400;

    pub fn initialize(
        env: Env,
        admin: Address,
        fungible: Address,
        borrow_token: Address,
    ) -> Result<(), Error> {
        env.storage()
            .instance()
            .set(&symbol_short!("admin"), &admin);

        env.storage()
            .instance()
            .set(&symbol_short!("fungible"), &fungible);

        env.storage()
            .instance()
            .set(&symbol_short!("borrow"), &borrow_token);

        Ok(())
    }

    pub fn deposit(
        env: Env,
        token_addr: Address,
        amount: i128,
        user: Address,
    ) -> Result<(), Error> {
        let fungible_token: Option<Address> =
            env.storage().instance().get(&symbol_short!("fungible"));

        match fungible_token {
            Some(token_address) => {
                if token_address != token_addr {
                    return Err(Error::UnmatchedToken);
                }

                // this is working code it will uncomment after some time...
                let token_client = token::Client::new(&env, &token_addr);
                token_client.transfer(&user, &env.current_contract_address(), &amount);

                let mut user_info = Self::get_user_balance(&env, user.clone());

                let current_timestamp = env.ledger().timestamp();
                let interest_earned = Self::calculate_interest(
                    user_info.total_deposit_balance,
                    user_info.last_deposit_time,
                    current_timestamp,
                );

                user_info.total_deposit_balance += interest_earned + amount;
                user_info.last_deposit_time = current_timestamp;

                env.storage().instance().set(&user, &user_info);
                Ok(())
            }
            None => Err(Error::TokenNotFound),
        }
    }

    pub fn borrow_token(env: &Env, user: Address, borrow_amount: i128) -> Result<(), Error> {
        let borrow_token: Option<Address> =
            env.storage().instance().get(&symbol_short!("fungible"));

        match borrow_token {
            Some(borrow) => {
                let mut user_info = Self::get_user_balance(env, user.clone());
                if user_info.total_deposit_balance == 0 {
                    return Err(Error::InsufficientDepositBalance);
                }
                if user_info.borrow_balance > 0 {
                    return Err(Error::AlreadyBorrowToken);
                }

                let max_borrowable = (user_info.total_deposit_balance * 80) / 100;
                if borrow_amount > max_borrowable {
                    return Err(Error::MaximumBorrowExceed);
                }

                // this is working code it will uncomment after some time...
                let token_client = token::Client::new(&env, &borrow);
                token_client.transfer(&env.current_contract_address(), &user, &borrow_amount);

                user_info.borrow_balance += borrow_amount;
                user_info.borrow_timestamp = env.ledger().timestamp();

                env.storage().instance().set(&user, &user_info);
                Ok(())
            }
            None => Err(Error::TokenNotFound),
        }
    }

    pub fn repay_token(env: &Env, user: Address, amount: i128) -> Result<(), Error> {
        let borrow_token: Option<Address> =
            env.storage().instance().get(&symbol_short!("fungible"));

        match borrow_token {
            Some(borrow) => {
                let mut user_info = Self::get_user_balance(env, user.clone());

                if user_info.borrow_balance < 0 {
                    return Err(Error::BorrowBalanceError);
                }

                if amount > user_info.borrow_balance {
                    return Err(Error::InsufficientBalance);
                }

                // this is working code it will uncomment after some time...
                let token_client = token::Client::new(&env, &borrow);
                let check_balance = token_client.balance(&user);

                if check_balance < amount {
                    return Err(Error::InsufficientBalance);
                }

                token_client.transfer(
                    &user,
                    &env.current_contract_address(),
                    &user_info.borrow_balance,
                );

                let current_timestamp = env.ledger().timestamp();
                let borrow_duration = current_timestamp - user_info.borrow_timestamp;

                let interest = Self::calculate_interest(
                    user_info.total_deposit_balance, // New total deposit after penalty
                    user_info.last_deposit_time,
                    current_timestamp,
                );
                user_info.total_deposit_balance += interest;

                if borrow_duration > 30 * 24 * 60 * 60 {
                    user_info.total_deposit_balance -= (user_info.total_deposit_balance * 5) / 100;
                }

                user_info.borrow_balance -= amount;

                user_info.last_deposit_time = current_timestamp;

                env.storage().instance().set(&user, &user_info);

                Ok(())
            }
            None => Err(Error::TokenNotFound),
        }
    }

    pub fn withdraw_token(env: &Env, user: Address, amount: i128) -> Result<(), Error> {
        let fungible_token: Option<Address> =
            env.storage().instance().get(&symbol_short!("fungible"));

        match fungible_token {
            Some(token_address) => {
                let mut user_info = Self::get_user_balance(env, user.clone());

                if user_info.total_deposit_balance == 0 {
                    return Err(Error::InsufficientDepositBalance);
                }
                if user_info.borrow_balance > 0 {
                    return Err(Error::AlreadyBorrowToken);
                }

                let current_timestamp = env.ledger().timestamp();
                let total_interest = Self::calculate_interest(
                    user_info.total_deposit_balance,
                    user_info.last_deposit_time,
                    current_timestamp,
                );

                // Total withdrawal amount = total deposit + total interest
                let total_withdrawal = user_info.total_deposit_balance + total_interest;

                if amount > total_withdrawal {
                    return Err(Error::InsufficientBalance);
                }

                let remaining_balance = total_withdrawal - amount;

                // this is working code it will uncomment after some time...
                let token_client = token::Client::new(&env, &token_address);
                token_client.transfer(&env.current_contract_address(), &user, &total_withdrawal);

                user_info.total_deposit_balance = remaining_balance;
                user_info.last_deposit_time = current_timestamp;

                env.storage().instance().set(&user, &user_info);
                Ok(())
            }
            None => Err(Error::TokenNotFound),
        }
    }

    pub fn calculate_interest(deposit: i128, last_deposit_time: u64, current_time: u64) -> i128 {
        if last_deposit_time == 0 || current_time <= last_deposit_time {
            return 0;
        }

        let days_held = (current_time - last_deposit_time) / Self::SECONDS_IN_A_DAY;
        let interest = (deposit * Self::DAILY_INTEREST_RATE * days_held as i128) / 100;

        interest
    }

    pub fn get_user_balance(env: &Env, user: Address) -> UserInfo {
        env.storage().instance().get(&user).unwrap_or(UserInfo {
            total_deposit_balance: 0,
            borrow_balance: 0,
            borrow_timestamp: 0,
            last_deposit_time: 0,
        })
    }

    pub fn get_admin(env: &Env) -> Address {
        env.storage()
            .instance()
            .get(&symbol_short!("admin"))
            .unwrap()
    }
}

mod test;
