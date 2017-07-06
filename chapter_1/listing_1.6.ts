import * as Decimal from "decimal.js";
import { Result, Ok, Err } from "space-lift";

/* tslint:disable:max-classes-per-file */

const today = new Date();

class Amount extends Decimal {
  public inspect() {
    return this.toString();
  }
}

class Balance {
  constructor(readonly amount: Amount = new Amount(0)) { }
}

class AccountError {
  constructor(
    readonly msg: string,
  ) { }

  public inspect() {
    return `AccountError: ${this.msg}`;
  }
}

type _MutableInner<T extends { [x: string]: any }, K extends string> = {
  [P in K]: T[P];
};

type Mutable<T> = _MutableInner<T, keyof T>;

abstract class Copyable<T> {
  public abstract copy(): T;

  public copyWith(props: Partial<T>): T {
      const c = this.copy() as Mutable<T>;
      let k: keyof T;
      for (k in props) {
        if (typeof props[k] !== "undefined") {
          c[k] = props[k]!;
        }
      }
      return c as T;
  }
}

class Account extends Copyable<Account> {
  constructor(
    readonly no: string,
    readonly name: string,
    readonly dateOfOpening: Date,
    readonly balance: Balance = new Balance(),
  ) {
    super();
  }

  public copy() {
    return new Account(this.no, this.name, this.dateOfOpening, this.balance) as this;
  }
}

function debit(a: Account, amount: Amount): Result<AccountError, Account> {
  if (a.balance.amount.lt(amount)) {
    return Err(new AccountError("Insufficient balance in account"));
  }
  return Ok(a.copyWith({
    balance: new Balance(new Amount(a.balance.amount.minus(amount))),
  }));
}

function credit(a: Account, amount: Amount): Result<AccountError, Account> {
  return Ok(a.copyWith({
    balance: new Balance(new Amount(a.balance.amount.plus(amount))),
  }));
}

const a = new Account("a1", "John", today, new Balance(new Amount(100)));
console.log("A", a);
debit(a, new Amount(10)).flatMap((b) => {
  console.log("B", b);
  return credit((b), new Amount(20));
}).map((c) => {
  console.log("C", c);
}).mapError((e) => {
  console.error(e);
});
