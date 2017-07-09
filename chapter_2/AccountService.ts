import { Result, Ok, Err, Option, Some, None } from "space-lift";
import { Amount, Balance, Account } from "./AccountModels";

export class AccountError {
  constructor(readonly message: string) { }
}

// Listing 3.1: AccountService trait
// Not sure why it's "parameterized" with Account, Amount, Balance in the book.
// Maybe that was a typo?
export interface IAccountService {
  open(no: string, name: string, openingDate: Option<Date>): Result<AccountError, Account>;
  close(account: Account, closeDate: Option<Date>): Result<AccountError, Account>;
  debit(account: Account, amount: Amount): Result<AccountError, Account>;
  credit(account: Account, amount: Amount): Result<AccountError, Account>;
  balance(account: Account): Result<AccountError, Balance>;

  // Without this syntax, the type of `this` in the implementation is inferred
  // as <any>
  transfer(this: IAccountService, from: Account, to: Account, amount: Amount):
      Result<AccountError, [Account, Account, Amount]>;
}

// Listing 3.3: "The interpreter of your algebra"
// Object.freeze maybe has a similar effect to sealing the trait in Scala?
export const AccountService = Object.freeze({
  open: (no: string, name: string, openingDate: Option<Date>) => {
    const today = new Date();
    if (no.length === 0 || name.length === 0) {
      return Err(new AccountError("Account no or name cannot be blank"));
    } else if (openingDate.getOrElse(today) < today) {
      return Err(new AccountError("Cannot open account in the past"));
    } else {
      return Ok(new Account(no, name, openingDate.getOrElse(today)));
    }
  },

  close: (account: Account, closeDate: Option<Date>) => {
    const today = new Date();
    const cd = closeDate.getOrElse(today);
    if (cd < account.dateOfOpen) {
      return Err(new AccountError(`Close date ${cd} cannot be before opening` +
        `date ${account.dateOfOpen}`));
    } else {
      return Ok(account.copy({dateOfClose: Some(cd)}));
    }
  },

  debit: (a: Account, amt: Amount) => {
    if (a.balance.amount.lt(amt)) {
      return Err(new AccountError("Insufficient balance"));
    } else {
      return Ok(a.copy({balance: new Balance(a.balance.amount.minus(amt))}));
    }
  },

  credit: (a: Account, amt: Amount) => {
    return Ok(a.copy({balance: new Balance(a.balance.amount.plus(amt))}));
  },

  balance: (account: Account) => {
    return Err(new AccountError("Not implemented"));
  },

  // Due to the this: type assertion in the interface, transfer cannot be
  // implemented as an arrow function
  transfer(from: Account, to: Account, amount: Amount) {
    return this.debit(from, amount).flatMap( (a) =>
      this.credit(to, amount).flatMap( (b) =>
        Ok([a, b, amount] as [Account, Account, Amount])));
  },
} as IAccountService);

export { Amount, Balance, Account };
