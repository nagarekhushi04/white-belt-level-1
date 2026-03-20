#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, vec, Address, Env, Symbol,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum FactoryError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Pool(Address, Address),
}

#[contract]
pub struct AMMFactory;

#[contractimpl]
impl AMMFactory {
    /// Initialize the factory with an admin address.
    pub fn init(env: Env, admin: Address) -> Result<(), FactoryError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(FactoryError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        Ok(())
    }

    /// Register a pool address for two assets.
    pub fn set_pool(
        env: Env,
        admin: Address,
        asset_a: Address,
        asset_b: Address,
        pool_address: Address,
    ) -> Result<(), FactoryError> {
        admin.require_auth();
        let stored_admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(FactoryError::NotInitialized)?;
        if admin != stored_admin {
            return Err(FactoryError::Unauthorized);
        }

        env.storage().instance().set(
            &DataKey::Pool(asset_a.clone(), asset_b.clone()),
            &pool_address,
        );

        #[allow(deprecated)]
        env.events()
            .publish((symbol_short!("NEW_POOL"), asset_a, asset_b), pool_address);
        Ok(())
    }

    /// Fetch the pool address for a given asset pair.
    pub fn get_pool(env: Env, asset_a: Address, asset_b: Address) -> Option<Address> {
        env.storage()
            .instance()
            .get(&DataKey::Pool(asset_a, asset_b))
    }

    /// Cross-contract call: fetch reserves from a deployed AMMPool.
    pub fn get_pool_reserves(env: Env, pool_address: Address) -> (u128, u128) {
        let res: (u128, u128) = env.invoke_contract(
            &pool_address,
            &Symbol::new(&env, "get_reserves"),
            vec![&env],
        );
        res
    }

    /// Get the admin address.
    pub fn get_admin(env: Env) -> Option<Address> {
        env.storage().instance().get(&DataKey::Admin)
    }
}
