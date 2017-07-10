#TypeScript-ified Examples from _Functional and Reactive Domain Modeling_

I'm reading a great book, 
[Functional and Reactive Domain Modeling](https://www.manning.com/books/functional-and-reactive-domain-modeling),
by Debasish Ghosh.  All the book's examples are in Scala, which is a perfectly reasonable
choice.  But, for reasons, I'm interested in applying the design principles from the book
to a project in TypeScript.  So, as I go, I'm trying to convert the Scala listings into
TypeScript.

However, I am not an expert in Scala, nor in TypeScript, so these examples might be
terrible.  Please feel free to submit issues to point out my horrid mistakes, or pull
requests to fix them.

##Running the Examples

I haven't got around to defining npm scripts yet, so in order to run the examples, you'll
want to, after running `npm install`, install TypeScript and ts-node globally:

`npm install -g typescript`

`npm install -g ts-node`

Then you can do something like `ts-node chapter_3/index.ts` to see the code in action.
However, most of the value is in reading the code to see what the examples look like in
TypeScript.  I've tried to comment sections with the appropriate listing numbers from the
book, but you may have to hunt a little to find what you're looking for.

This is a work in progress, and therefore incomplete.  I have skipped over several
examples that felt too trivial to spend time converting, but I'm open to requests to go
back and revisit anything that's missing.

Enjoy, and I hope you get some value out of this.