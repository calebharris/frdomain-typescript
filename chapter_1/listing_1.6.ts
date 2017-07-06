// Use decimal.js to fill in for Java's BigDecimal, used extensively in the
// examples
import * as Decimal from "decimal.js";

// Use Result from space-lift to fill in for Scala's Try monad
import { Result, Ok, Err } from "space-lift";

const today = new Date();

// We want to alias both the Decimal type and the Decimal value
// (i.e. Decimal's constructor function)
type Amount = decimal.Decimal;
const Amount = Decimal;

class Balance {
  constructor(readonly amount: Amount = new Amount(0)) { }

  // Added to make output more meaningful
  public inspect() {
    return `Balance { amount: ${this.amount.toString()} }`;
  }
}

// Added because space-lift's Result requires two types:
// an error type and a value type
class AccountError {
  constructor(
    readonly msg: string,
  ) { }

  public inspect() {
    return `AccountError: ${this.msg}`;
  }
}

// BEGIN - emulate the copy() method Scala adds to case classes
type _MutableInner<T extends { [x: string]: any }, K extends string> = {
  [P in K]: T[P];
};

type Mutable<T> = _MutableInner<T, keyof T>;

abstract class Copyable<T> {
  // We need the subtype to tell us how to make a copy, because there is no
  // general algorithm to map object properties to positional parameters in
  // the constructor, outside of some truly ugly function.toString() parsing
  public abstract copy(): T;

  public copyWith(props: Partial<T>): T {
    // Temporarily consider the copy mutable in order to apply the passed-in
    // property overrides
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
// END - copy() method emulation

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
