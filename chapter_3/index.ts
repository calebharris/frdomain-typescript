import { Amount, Balance, Account, AccountService } from "./AccountService";
import { Some } from "space-lift";
import * as Decimal from "decimal.js";

AccountService.open("123", "Grace Hopper", Some(new Date(2017, 12, 25)))
  .flatMap( (a) => {
    console.log(a);
    return AccountService.credit(a, new Amount(100))
      .flatMap( (b) => {
        console.log(b);
        return AccountService.debit(b, new Amount(50))
          .flatMap( (c) => {
            console.log(c);
            return AccountService.close(c, Some(new Date(2017, 12, 31)))
              .map( (d) => {
                console.log(d);
                return d;
              });
          });
      });
  })
  .mapError( (err) => console.log(err) );

AccountService.open("123", "Alan Turing", Some(new Date(2017, 8, 1))).flatMap(
  (a) => {
    return AccountService.open("456", "Grace Hopper", Some(new Date(2017, 9, 1))).map(
      (b) => {
        console.log(`a.equals(b): ${a.equals(b)}`);
        return b;
      }
    )
  }
).mapError( (err) => console.log(err) );

let c = Decimal(1);
let d = Decimal(1);
console.log(`c === d: ${c === d}`);
