#![cfg(test)]
use super::{Contract, ContractClient};
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_increment() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, Contract);
    let client = ContractClient::new(&env, &contract_id);

    let user = Address::generate(&env);
    
    // First increment
    client.increment(&user);
    assert_eq!(client.get_count(), 1);
    assert_eq!(client.get_last_user(), Some(user.clone()));

    // Different user increment
    let user2 = Address::generate(&env);
    client.increment(&user2);
    assert_eq!(client.get_count(), 2);
    assert_eq!(client.get_last_user(), Some(user2.clone()));
}

#[test]
#[should_panic(expected = "RepeatUserNotAllowed")]
fn test_repeat_user_not_allowed() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, Contract);
    let client = ContractClient::new(&env, &contract_id);

    let user = Address::generate(&env);
    client.increment(&user);
    client.increment(&user); // Should panic
}
