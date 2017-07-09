import { Amount, Balance, Account, AccountService } from "./AccountService";
import { Some } from "space-lift";

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
