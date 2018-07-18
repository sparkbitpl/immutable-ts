# immutable-typescript
`Immutable-typescript` is a library that provides immutable objects in TypeScript.
An instance of standard TypeScript POJO-like class, such as
```typescript
export class Book {
    constructor(public title: string,
                public publicationYear: number) {}
}

export class Author {
    constructor(public name: string,
                public books: Book[]) {}
}
```
can be converted to immutable using `immutable-typescript` in the following way:
```typescript
import {Immutable, ImmutableUtils} from "immutable-typescript";
const book1 = new Book("Journey to the Center of the Earth", 1864);
const book2 = new Book("The Mysterious Island", 1875);
const mutableInstance
        = new Author("Jules Verne", [book1, book2]);

// convert to immutable
const immutable: Immutable<Author>
        = ImmutableUtils.asImmutable(mutableInstance);

// now, we can access any of the properties of immutable:
console.log(immutable.name);
console.log(immutable.books[0].publicationYear);

// but modifying any of them will fail to compile
immutable.name = "Foo"; // compilation error
immutable.books[0] = new Book(...); // compilation error
immutable.books[0].publicationYear = 2018; // compilation error
immutable.books.push(new Book(...)); // compilation error
```

`Immutable-typescript` provides operators to set properties of immutable objects. These operators create a copy of the original object,
with the updated value of the modified property:
```typescript
// creates a new instance with an updated name property
const updated = ImmutableUtils.update(immutable).set("name", "Foo");

// fails to compile, as name in type Author is not of type number:
ImmutableUtils.update(immutable).set("name", 42);

// fails to compile, as nonexistentProperty does not exist in type Author:
ImmutableUtils.update(immutable).set("nonexistingProperty", "Boom!");

```
As you can see, the setter operators are type safe: they statically check both the property name and the type.
It is also possible to update a nested value, e.g.:
```typescript
const updated: Immutable<Author>
        = ImmutableUtils.update(immutable)
                        .at("books")
                        .at(0)
                        .set("publicationYear", 2018);
```
Also in this case, all the property names are statically validated.

`Immutable-typescript` exposes also parameterless functions from the underlying object in the `Immutable`:

```typescript
class Foo {
        ...
}

class Bar {
        ...
        public getFoo(): Foo = {
                ...
        }
}

const bar: Bar = ...;
const immBar: Immutable<Bar> = ImmutableUtils(bar);

const result: Immutable<Foo> = immBar.getFoo();
```

Note - the library does not validate if the function is pure, so use this feature with extreme caution.
