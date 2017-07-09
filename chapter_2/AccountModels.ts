// Use decimal.js to fill in for Java's BigDecimal, used extensively in the
// examples
import * as Decimal from "decimal.js";

import { Option, None } from "space-lift";

import { Copyable } from "../lib/Copyable";

import * as util from "util";

// We want to alias both the Decimal type and the Decimal value
// (i.e. Decimal's constructor function)
export type Amount = decimal.Decimal;
export const Amount = Decimal;

export class Balance {
  constructor(readonly amount: Amount = new Amount(0)) { }

  // Added to make output more meaningful
  public inspect() {
    return `Balance { amount: ${this.amount.toString()} }`;
  }
}

export class Account extends Copyable<Account> {
  constructor(
    readonly no: string,
    readonly name: string,
    readonly dateOfOpen: Date,
    readonly dateOfClose: Option<Date> = None,
    readonly balance: Balance = new Balance(),
  ) {
    super();
  }

  public copy() {
    return new Account(this.no, this.name, this.dateOfOpen, this.dateOfClose, this.balance) as this;
  }

  public inspect() {
    return `Account {
  no: ${util.inspect(this.no)},
  name: ${util.inspect(this.name)},
  dateOfOpen: ${util.inspect(this.dateOfOpen)},
  dateOfClose: ${this.dateOfClose.isDefined() ? util.inspect(this.dateOfClose.get()) : "None"},
  balance: ${util.inspect(this.balance)} }`;
  }
}
