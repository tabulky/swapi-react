# View Types

Enriched schemas for app use. Each `*View` module extends an auto-generated
SWAPI schema, overriding raw string fields with parsed types (numbers, arrays,
URLs, etc.) via [Valibot](https://valibot.dev/) transforms.

## Shared helpers (`viewSchemaHelpers.ts`)

### `toNumberOrString`

Converts a string to a `number` when possible, otherwise keeps the original
string. Used for SWAPI fields like `cost_in_credits`, `length`, `passengers`,
etc. that are sometimes numeric (`"3500000"`) and sometimes not (`"n/a"`,
`"30-165"`).

```ts
v.parse(toNumberOrString, "3500000"); // → 3500000
v.parse(toNumberOrString, "n/a"); // → "n/a"
```

---

### `toStringArray`

Splits a comma-separated string into a trimmed `string[]`. Used for fields
like `producer` (in `filmView`) and `climate`/`terrain` (in `planetView`).

```ts
v.parse(toStringArray, "Gary Kurtz, Rick McCallum");
// → ["Gary Kurtz", "Rick McCallum"]
```

---

### `toCorpStringArray` — Manufacturer string splitter

Interesting situation here, when splitting manufacturers from the SWAPI data.
The `manufacturer` field uses commas both as **separators** between companies
_and_ inside corporate names like "Gallofree Yards, Inc." — so a naive
`.split(",")` would break those names apart.

#### The tricky part

| Input                                                   | Expected output                                             |
| ------------------------------------------------------- | ----------------------------------------------------------- |
| `"Kuat Drive Yards, Fondor Shipyards"`                  | `["Kuat Drive Yards", "Fondor Shipyards"]`                  |
| `"Gallofree Yards, Inc."`                               | `["Gallofree Yards, Inc."]`                                 |
| `"Alliance Underground Engineering, Incom Corporation"` | `["Alliance Underground Engineering", "Incom Corporation"]` |

That last one is the sneaky edge case — `Inc` appears as a prefix of "**Inc**om",
so without care the regex would refuse to split there, gluing both manufacturers
into one string.

#### The fix

The regex splits on commas **unless** the next word is a known corporate suffix
(`Inc.`, `Inc`, `Ltd.`, `Corp.`, `Co.`, `LLC`, `Incorporated`):

```regex
/,\s*(?!\s*(?:Inc\.?|Ltd\.?|Corp\.?|Co\.?|LLC|Incorporated)(?!\w))/
```

The `(?!\w)` word-boundary guard at the end is the key — it makes sure `Inc`
only matches as a standalone word, not as part of "Incom". Without it, the
"Incom Corporation" case silently fails.

#### ReDoS safety

No nested quantifiers or overlapping alternation — the pattern is safe from
catastrophic backtracking.

# Adding new helpers

Build new transforms by composing Valibot's [`v.pipe()`](https://valibot.dev/api/pipe/) with [`v.transform()`](https://valibot.dev/api/transform/) — same pattern as the helpers above.
