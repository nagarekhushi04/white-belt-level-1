#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, log};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    InsufficientReserves = 3,
    DivideByZero = 4,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    AssetA,
    AssetB,
    ReserveA,
    ReserveB,
    Factory,
}

#[contract]
pub struct AMMPool;

#[contractimpl]
impl AMMPool {
    /// Initialize the pool with Asset addresses and the Factory address.
    pub fn init(env: Env, factory: Address, asset_a: Address, asset_b: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Factory) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Factory, &factory);
        env.storage().instance().set(&DataKey::AssetA, &asset_a);
        env.storage().instance().set(&DataKey::AssetB, &asset_b);
        env.storage().instance().set(&DataKey::ReserveA, &0u128);
        env.storage().instance().set(&DataKey::ReserveB, &0u128);
        Ok(())
    }

    /// Add liquidity (Simulated without full token transfers for speed).
    pub fn add_liquidity(env: Env, from: Address, amount_a: u128, amount_b: u128) {
        from.require_auth();
        let reserve_a: u128 = env.storage().instance().get(&DataKey::ReserveA).unwrap();
        let reserve_b: u128 = env.storage().instance().get(&DataKey::ReserveB).unwrap();

        env.storage().instance().set(&DataKey::ReserveA, &(reserve_a + amount_a));
        env.storage().instance().set(&DataKey::ReserveB, &(reserve_b + amount_b));

        env.events().publish(
            (symbol_short!("L_ADD"), from),
            (amount_a, amount_b)
        );
    }

    /// Swap Asset A for Asset B using Constant Product (x * y = k).
    pub fn swap_a_to_b(env: Env, from: Address, amnt_in: u128) -> Result<u128, Error> {
        from.require_auth();
        let res_a: u128 = env.storage().instance().get(&DataKey::ReserveA).ok_or(Error::NotInitialized)?;
        let res_b: u128 = env.storage().instance().get(&DataKey::ReserveB).ok_or(Error::NotInitialized)?;

        // Standard AMM math: amnt_out = (res_b * amnt_in) / (res_a + amnt_in)
        if (res_a + amnt_in) == 0 {
            return Err(Error::DivideByZero);
        }
        let amnt_out = (res_b * amnt_in) / (res_a + amnt_in);

        if amnt_out >= res_b {
            return Err(Error::InsufficientReserves);
        }

        env.storage().instance().set(&DataKey::ReserveA, &(res_a + amnt_in));
        env.storage().instance().set(&DataKey::ReserveB, &(res_b - amnt_out));

        env.events().publish(
            (symbol_short!("SWAP"), from),
            (amnt_in, amnt_out)
        );
        Ok(amnt_out)
    }

    pub fn get_reserves(env: Env) -> (u128, u128) {
        let res_a: u128 = env.storage().instance().get(&DataKey::ReserveA).unwrap();
        let res_b: u128 = env.storage().instance().get(&DataKey::ReserveB).unwrap();
        (res_a, res_b)
    }
}
