#![cfg(test)]

use core::result;

use super::*;
use soroban_sdk::{vec, Env, String};

#[test]
fn test() {
    let env = Env::default();
    let contract_id = env.register_contract(None, IncluderContract);
    let client = IncluderContractClient::new(&env, &contract_id);

    let amount: i128 = 100000000;

    let admin = Address::from_string(&String::from_str(
        &env,
        "GCYLJJAPJMRUGM2L7SSRQ3MNFRGL3JO6WPCBU75SEXGSL6RAXBFN7SZI",
    ));
    let fungible = Address::from_string(&String::from_str(
        &env,
        "CCA7673FXGILSKO4RIJTJ6ZYGRNOAOMSMFBUGDFE6OTSENWQCN3E5G5I",
    ));

    client.initialize(&admin, &fungible, &fungible);
    let result = client.get_admin();
    assert_eq!(result, admin);

    let borrow_amount = (amount * 80) / 100;

    client.deposit(&fungible, &amount, &admin);
    client.borrow_token(&admin, &borrow_amount);
    client.repay_token(&admin, &borrow_amount);
    client.withdraw_token(&admin, &amount);

    let user_result = client.get_user_balance(&admin);
    assert_eq!(user_result.total_deposit_balance, 0);
    assert_eq!(user_result.borrow_balance, 0);
}
