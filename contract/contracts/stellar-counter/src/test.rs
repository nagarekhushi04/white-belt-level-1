#![cfg(test)]
use super::{Contract, ContractClient};
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_increment() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let user = Address::generate(&env);
    
    // First increment
    let count = client.increment(&user);
    assert_eq!(count, 1u128);
    assert_eq!(client.get_count(), 1u128);
    assert_eq!(client.get_last_user(), Some(user.clone()));

    // Different user increment
    let user2 = Address::generate(&env);
    let count2 = client.increment(&user2);
    assert_eq!(count2, 2u128);
    assert_eq!(client.get_count(), 2u128);
    assert_eq!(client.get_last_user(), Some(user2.clone()));
}

#[test]
#[should_panic(expected = "RepeatUserNotAllowed")]
fn test_repeat_user_not_allowed() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let user = Address::generate(&env);
    client.increment(&user);
    client.increment(&user); // Should panic
}
