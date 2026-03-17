#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, contracttype, Address, Env, Symbol};

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
pub enum DataKey {
    Counter,
    LastUser,
}

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn get_count(env: Env) -> u64 {
        env.storage().persistent().get(&DataKey::Counter).unwrap_or(0)
    }

    pub fn get_last_user(env: Env) -> Option<Address> {
        env.storage().persistent().get(&DataKey::LastUser)
    }

    pub fn reset(env: Env, user: Address) {
        user.require_auth();
        env.storage().persistent().remove(&DataKey::Counter);
        env.storage().persistent().remove(&DataKey::LastUser);
        let topic = Symbol::new(&env, "reset");
        env.events().publish((topic,), (user,));
    }

    pub fn increment(env: Env, user: Address) {
        user.require_auth();

        // 1. Check if we've reached the limit
        let mut count = Self::get_count(env.clone());
        if count >= 100 {
            panic!("MaxReached");
        }

        // 2. Performance check: Don't allow same user twice in a row (if count > 0)
        if count > 0 {
            if let Some(last_user) = Self::get_last_user(env.clone()) {
                if last_user == user {
                    panic!("RepeatUserNotAllowed");
                }
            }
        }

        count = count.checked_add(1).expect("Overflow");

        env.storage().persistent().set(&DataKey::Counter, &count);
        env.storage().persistent().set(&DataKey::LastUser, &user);

        let topic = Symbol::new(&env, "increment");
        let value = (user, count);
        env.events().publish((topic,), value);
    }
}

mod test;
