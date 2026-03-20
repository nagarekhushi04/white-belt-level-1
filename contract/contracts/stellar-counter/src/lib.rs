#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    MaxReached = 1,
    RepeatUserNotAllowed = 2,
    UnauthorizedReset = 3,
    CounterOverflow = 4,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Counter,
    LastUser,
}

#[contract]
pub struct StellarCounter;

#[contractimpl]
impl StellarCounter {
    pub fn get_count(env: Env) -> u128 {
        env.storage().instance().get(&DataKey::Counter).unwrap_or(0u128)
    }

    pub fn get_last_user(env: Env) -> Option<Address> {
        env.storage().instance().get(&DataKey::LastUser)
    }

    pub fn reset(env: Env, user: Address) {
        user.require_auth();
        env.storage().instance().remove(&DataKey::Counter);
        env.storage().instance().remove(&DataKey::LastUser);
        
        #[allow(deprecated)]
        env.events().publish(
            (symbol_short!("RESET"), user.clone()),
            (user,)
        );
    }

    pub fn increment(env: Env, user: Address) -> u128 {
        user.require_auth();

        let mut count = Self::get_count(env.clone());
        if count >= 100 {
            panic!("MaxReached");
        }

        if count > 0 {
            if let Some(last_user) = Self::get_last_user(env.clone()) {
                if last_user == user {
                    panic!("RepeatUserNotAllowed");
                }
            }
        }

        count = count.checked_add(1).expect("Overflow");

        env.storage().instance().set(&DataKey::Counter, &count);
        env.storage().instance().set(&DataKey::LastUser, &user);

        #[allow(deprecated)]
        env.events().publish(
            (symbol_short!("INC"), user.clone()),
            (user, count)
        );
        count
    }
}

mod test;
