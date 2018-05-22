# knex-case

⚙️ A Knex.js _plugin_ to add case statement support

## Installation

```
$ yarn add knex-case
```

or

```
$ npm i knex-case
```

## Usage

#### Simple

```SQL
(CASE WHEN column=1 THEN 1 ELSE 0 END)
```

```javascript
require('knex-case');
const Knex = require('knex')({ client: 'mssql' });

const q = Knex.queryBuilder()
  .when('column', '=', 1)
  .thenElse(1, 0)
  .toQuery();

console.log(q); // (CASE WHEN column=1 THEN 1 ELSE 0 END);
```

#### Conditional Simple

```SQL
(CASE WHEN column=1 OR column=2 THEN 1 ELSE 0 END)
```

```javascript
require('knex-case');
const Knex = require('knex')({ client: 'mssql' });

const q = Knex.queryBuilder()
  .when('column', '=', 1)
  .orWhen('column', '=', 2)
  .thenElse(1, 0)
  .toQuery();

console.log(q); // (CASE WHEN column=1 OR column=2 THEN 1 ELSE 0 END);
```

#### Nested Simple

```SQL
(CASE WHEN column=1 THEN (CASE WHEN column='' THEN 2 ELSE 0 END) ELSE 0 END)
```

```javascript
require('knex-case');
const Knex = require('knex')({ client: 'mssql' });

const q = Knex.queryBuilder()
  .when('column', '=', 1)
  .thenElse(
    Knex.queryBuilder()
      .when('column', '=', `''`)
      .thenElse(2, 0)
  )
  .else(0)
  .toQuery();

console.log(q); // (CASE WHEN column=1 THEN (CASE WHEN column='' THEN 2 ELSE 0 END) ELSE 0 END);
```

## Caveats

#### String Escaping

Currently if you want to output correct SQL that includes string comparisons (ie. `something='some-string'`) you will have to escape the internal value.

Example:

```javascript
// String literals
Knex.queryBuilder().when('something', '=', `'some-string'`);

// Escape sequences
Knex.queryBuilder().when('something', '=', "'some-string'");

// Alternating quotations
Knex.queryBuilder().when('something', '=', "'some-string'");
```
