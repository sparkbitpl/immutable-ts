# immutable-typescript
`Immutable-typescript` is a library that provides immutable objects in TypeScript.
An instance of standard TypeScript POJO-like class, such as
```typeScript
export class Book {
    constructor(public title: string, public publicationYear: number) {}
}
export class Country {
    constructor(public name: string, public isoCode: string) {}
}
export class Author {
    constructor(public name: string, public books: Book[], public countryOfOrigin: Country) {}
}
```
can be converted to immutable using `immutable-typescript` in the following way:
```typeScript
import {Immutable, ImmutableUtils} from "immutable-typescript";
const book1 = new Book("Journey to the Center of the Earth", 1864);
const book2 = new Book("The Mysterious Island", 1875);
const mutableInstance = new Author("Jules Verne", [book1, book2], new Country("France", "FR"));
const immutableInstance: Immutable<Author> = ImmutableUtils.asImmutable(mutableInstance);

// now, we can access any of the properties of immutableInstance:
console.log(immutableInstance.name);
console.log(immutableInstance.books[0].publicationYear);

// but modifying any of them will fail to compile
immutableInstance.name = "Foo"; // compilation error
immutableInstance.books[0] = new Book(...); // compilation error
immutableInstance.books[0].publicationYear = 2018; // compilation error
immutableInstance.books.push(new Book(...)); // compilation error
```

`Immutable-typescript` provides operators to set properties of immutable objects. These operators create a copy of the original object,
with the updated value of the modified property:
```typeScript
// creates a new instance with an updated name property
const updatedInstance = ImmutableUtils.setValue(immutableInstance, "name", "Foo");

// fails to compile, as name in type Author is not of type number:
const updatedInstance = ImmutableUtils.setValue(immutableInstance, "name", 42);

// fails to compile, as nonexistentProperty does not exist in type Author:
ImmutableUtils.setValue(immutableInstance, "nonexistingProperty", "Boom!");

```
As you can see, the setter operators are type safe: they statically check both the property name and the type.
It is also possible to update a nested value, e.g.:
```typeScript
const updatedInstance: Immutable<Author> = ImmutableUtils.setValue2(immutableInstance, "country", "isoCode", "DE");
```
Also in this case, all the property names are statically validated.
