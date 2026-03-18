#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

mod pool {
    soroban_sdk::contractimport!(file = "../amm-pool/target/wasm32-unknown-unknown/release/amm_pool.wasm");
}

#[contract]
pub struct AMMFactory;

#[contracttype]
pub enum DataKey {
    Admin,
    Pools(Address, Address), // Mapping AssetA, AssetB to PoolAddress
}

#[contractimpl]
impl AMMFactory {
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Link a pool address for two assets (Level 4: Managing multiple instances).
    pub fn set_pool(env: Env, admin: Address, asset_a: Address, asset_b: Address, pool_address: Address) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Not authorized");
        }

        env.storage().instance().set(&DataKey::Pools(asset_a.clone(), asset_b.clone()), &pool_address);
        
        env.events().publish(
            (symbol_short!("NEW_POOL"), asset_a, asset_b),
            pool_address
        );
    }

    /// Interact with the Pool: Fetch remote reserves (Level 4: Cross-Contract Call Pattern).
    pub fn get_pool_reserves(env: Env, pool_address: Address) -> (u128, u128) {
        // Cross-contract call using the imported WASM trait
        let client = pool::Client::new(&env, &pool_address);
        client.get_reserves()
    }
}
