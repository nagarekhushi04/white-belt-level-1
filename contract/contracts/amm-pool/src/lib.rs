#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env};

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
        let res_a: u128 = env.storage().instance().get(&DataKey::ReserveA).unwrap_or(0);
        let res_b: u128 = env.storage().instance().get(&DataKey::ReserveB).unwrap_or(0);
        (res_a, res_b)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn test_swap() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(AMMPool, ());
        let client = AMMPoolClient::new(&env, &contract_id);

        let factory = Address::generate(&env);
        let asset_a = Address::generate(&env);
        let asset_b = Address::generate(&env);
        let user = Address::generate(&env);

        client.init(&factory, &asset_a, &asset_b);
        client.add_liquidity(&user, &1000u128, &500u128);

        // Swap 100 A -> B
        // output = (500 * 100) / (1000 + 100) = 50000 / 1100 = 45
        let output = client.swap_a_to_b(&user, &100u128);
        assert_eq!(output, 45);

        let (res_a, res_b) = client.get_reserves();
        assert_eq!(res_a, 1100);
        assert_eq!(res_b, 500 - 45);
    }

    #[test]
    fn test_init_once() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(AMMPool, ());
        let client = AMMPoolClient::new(&env, &contract_id);

        let factory = Address::generate(&env);
        let asset_a = Address::generate(&env);
        let asset_b = Address::generate(&env);

        client.init(&factory, &asset_a, &asset_b);

        // Second init should fail
        let result = client.try_init(&factory, &asset_a, &asset_b);
        assert!(result.is_err());
    }

    #[test]
    fn test_empty_reserves() {
        let env = Env::default();
        let contract_id = env.register(AMMPool, ());
        let client = AMMPoolClient::new(&env, &contract_id);

        let (a, b) = client.get_reserves();
        assert_eq!(a, 0);
        assert_eq!(b, 0);
    }
}
