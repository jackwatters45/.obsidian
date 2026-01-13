# Obsidian Web Clipper Selector Syntax

Reference for building clipper template selectors.

## Variable Types

| Type | Syntax | Description |
|------|--------|-------------|
| Preset | `{{title}}`, `{{url}}`, `{{author}}` | Auto-extracted from page |
| Selector | `{{selector:cssSelector}}` | CSS selector for text content |
| Selector HTML | `{{selectorHtml:cssSelector}}` | CSS selector for HTML content |
| Meta | `{{meta:property}}` | Meta tag content |
| Schema | `{{schema:path}}` | Schema.org data |

## Selector Syntax

### Basic Selectors

```
{{selector:h1}}                    → First h1 text content
{{selector:.classname}}            → First element with class
{{selector:#id}}                   → Element by ID
{{selector:div.class}}             → Element type + class
```

### Attribute Extraction

```
{{selector:img?src}}               → src attribute of first img
{{selector:a?href}}                → href attribute of first link
{{selector:meta[name="author"]?content}}  → meta tag content attribute
```

### Multiple Classes (IMPORTANT)

**Chained classes may not work:** `.class1.class2`

**Use parent-child instead:**
```
{{selector:li.parent span.child}}  → Works reliably
{{selector:.parent .child}}        → Works reliably
```

### Multiple Elements

By default, `{{selector:...}}` returns **only the first match**.

To get all matches, use array filters:
```
{{selector:.item|join}}            → "a, b, c" (comma-separated)
{{selector:.item|list}}            → ["a", "b", "c"] (array)
{{selector:.item|wikilink|join}}   → "[[a]], [[b]], [[c]]"
```

## Filters

### Array/Object Filters

| Filter | Purpose | Example |
|--------|---------|---------|
| `join` | Combine to string | `\|join` → "a, b, c" |
| `first` | First element | `\|first` → "a" |
| `last` | Last element | `\|last` → "c" |
| `unique` | Remove duplicates | `\|unique` |
| `slice:start,end` | Subset | `\|slice:0,2` |
| `split:"delim"` | String to array | `\|split:", "` |
| `list` | Force array format | `\|list` |

### Text Filters

| Filter | Purpose | Example |
|--------|---------|---------|
| `trim` | Remove whitespace | `\|trim` |
| `lower` | Lowercase | `\|lower` |
| `upper` | Uppercase | `\|upper` |
| `replace:"a","b"` | Replace text | `\|replace:"old","new"` |
| `wikilink` | Wrap in [[]] | `\|wikilink` → "[[text]]" |

### HTML Filters

| Filter | Purpose | Example |
|--------|---------|---------|
| `markdown` | Convert HTML to MD | `{{selectorHtml:article\|markdown}}` |
| `strip_tags` | Remove HTML tags | `\|strip_tags` |
| `remove_html:"sel"` | Remove elements | `\|remove_html:".ads"` |

### Date Filters

| Filter | Purpose | Example |
|--------|---------|---------|
| `date:"format"` | Format date | `\|date:"YYYY-MM-DD"` |

## Common Patterns

### Single Value
```json
{
  "name": "title",
  "value": "{{selector:h1.title}}",
  "type": "text"
}
```

### Multiple Values (multitext)
```json
{
  "name": "tags",
  "value": "{{selector:.tag|join}}",
  "type": "multitext"
}
```

### Attribute Value
```json
{
  "name": "image",
  "value": "{{selector:meta[property='og:image']?content}}",
  "type": "text"
}
```

### Wikilinks from Multiple Elements
```json
{
  "name": "authors",
  "value": "{{selector:.author|unique|wikilink|join}}",
  "type": "multitext"
}
```

### URL Path Extraction
```json
{
  "name": "username",
  "value": "{{url|split:\"/\"|slice:3,4}}",
  "type": "text"
}
```

## Debugging

Test in browser console:
```javascript
document.querySelectorAll('.your-selector').length
Array.from(document.querySelectorAll('.selector')).map(el => el.textContent.trim())
```

## Sources

- [Variables Documentation](https://help.obsidian.md/web-clipper/variables)
- [Filters Documentation](https://help.obsidian.md/web-clipper/filters)
