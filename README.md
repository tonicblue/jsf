# JSF
Bootstrappable JSON Schema form generation

** WARNING: Seriously slow work in progress **

The idea is if:
* you have a thing that can generate a form that outputs data to **any** schema given that schema;
* you have a schema that represents what a JSON Schema can look like; and
* you were serious about that first point, schema-schema -> thing -> ability to create schema-schema.

Which to me is kinda _bootstrappable_. Either way, you'll end up with a hecking powerful form generation utility at the end of it. In addition to this, I want to allow minimal but powerful-enough customisation through templating and formatting so you can really make your forms work the way you want. It'd also be neat if I can get it resolving any schema properly and cache them. Can't wait to hook it up to something like [schemastore.org/json/](https://www.schemastore.org/json/).

This is all part of my grand plan which has been simmering for over a decade now.

## Installation

It's a standard empty [`bun.sh`](`https://bun.sh`) TypeScript project just to get me up and running quickly
To install dependencies:

```bash
bun install
```

To run (and by run I mean, ping the `index.ts` script with whatever test data that happens to be in there):

```bash
bun start
```