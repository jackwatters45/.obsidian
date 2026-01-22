# AGENTS.md - Jack's Obsidian Vault

This is an **Obsidian vault** for personal knowledge management, not a code repository.
AI agents should treat this as a structured note-taking system with specific conventions.

## Vault Structure

```
/                       # Root - personal notes, screenshots, PDFs
├── Categories/         # Index pages for each content type
├── Clippings/          # Web clippings and articles
├── Daily/              # Daily notes (YYYY-MM-DD.md format)
├── Files/              # Attachments and files
├── References/         # Books, authors, and reference material
├── Templates/          # Templates for all note types
│   └── Bases/          # Dataview base queries (.base files)
├── Weekly/             # Weekly notes (YYYY-Www.md format)
├── .clipper-templates/ # Obsidian Web Clipper templates
└── z_move/             # Staging area for reorganization
```

## File Naming Conventions

| Type         | Format            | Example                                                         |
| ------------ | ----------------- | --------------------------------------------------------------- |
| Daily notes  | `YYYY-MM-DD.md`   | `2026-01-07.md`                                                 |
| Weekly notes | `YYYY-Www.md`     | `2026-W02.md`                                                   |
| Books        | Title as filename | `The Art of Doing Science and Engineering Learning to Learn.md` |
| Clippings    | Article title     | `Compound Engineering How Every Codes With Agents.md`           |
| People       | Full name         | `Richard Hamming.md`                                            |

## Frontmatter Schema

All notes use YAML frontmatter. Common patterns:

### Daily Notes

```yaml
---
tags:
  - daily
---
```

### Books

```yaml
---
categories:
  - "[[Books]]"
author: [] # Links to author notes
genre: [] # Links to genre notes
cover: # URL to cover image
pages: # Number of pages
year: # Publication year
scoreGr: # Goodreads score
rating: # Personal rating
language: # Language(s)
topics: [] # Related topics
finished: # Date finished reading
tags:
  - to-read # or "reading", "books" when done
series: [] # Book series
---
```

### Clippings (Web Articles)

```yaml
---
categories:
  - "[[Clippings]]"
tags:
  - clippings
author: [] # Article author(s)
url: "" # Source URL
published: # Original publish date
topics: [] # Related topics
---
```

### Projects

```yaml
---
categories:
  - "[[Projects]]"
type: [] # Project type
org: [] # Associated organization
start: # Start date
year: # Year
url: # Project URL
status: # Current status
---
```

### People

```yaml
---
categories:
  - "[[People]]"
birthday:
org: [] # Organizations
linkedin:
instagram:
email:
phone:
met: # When first met
last contact: # Last interaction date
---
```

### GitHub Repos

```yaml
---
categories:
  - "[[GitHub]]"
author: [] # Repo owner
stars: # Star count
url: # Repo URL
description: # Repo description
tags:
  - coding
---
```

## Linking Conventions

- **Internal links**: Use `[[Note Name]]` or `[[Note Name|Display Text]]`
- **Category references**: Always link to category pages like `"[[Books]]"`, `"[[People]]"`
- **Embed content**: Use `![[filename]]` for embeds (e.g., `![[Daily.base]]`)
- **Tags**: Use `#tag-name` format, prefer lowercase with hyphens

## Tag System

### Status Tags

- `#to-read` - Queued for reading
- `#reading` - Currently reading
- `#read` - Finished reading
- `#daily`, `#weekly`, `#monthly` - Temporal notes

### Category Tags

- `#categories` - Category index pages
- `#clippings` - Web clippings
- `#books` - Book entries
- `#home` - Appears on home page

### Special Tags

- `#0🌲` - Evergreen notes (mature, refined ideas)

## Template System

Templates live in `/Templates/` and use Templater syntax:

- `{{date}}` - Current date
- `{{time}}` - Current time

### Available Templates

- Daily Note Template - Standard daily note
- Tomorrow Daily Note Template - Creates tomorrow's note (`Alt+Cmd+D`)
- Weekly Note Template - Weekly summary
- Content types: Book, Movie, Show, Podcast, Album, Gym, Food, App
- People: People, Author, Director, Actor, Artist
- Places: Place, City, Restaurant
- Projects: Project, Company
- Reference: Clipping, Evergreen, Post
- Communication: Email, Job Interview, Meeting

## Categories

Categories are index pages that embed a `.base` query file:

- Actors, Albums, Apps, Articles, Artists, Authors, Books, Career, Companies
- Directors, Emails, Events, Evergreen, Files, Food, Genre, GitHub, Gym
- Inspiration, Learning, Meetings, Movies, People, Places, Podcasts, Posts
- Products, Projects, Recipes, Restaurants, Shows, Songs, Tech, Trips

## Base Queries (.base files)

The `Templates/Bases/` folder contains Dataview queries that render dynamic content:

- `Daily.base` - Shows entries related to current daily note
- `Books.base` - Book library views with Author filter
- `Movies.base` - Movie library with Actor/Director filters
- `Shows.base` - TV shows with Actor filter
- `Albums.base` - Music albums with Artist filter
- `Authors.base` - Authors with their books
- `Actors.base` - Actors with their movies/shows
- `Directors.base` - Directors with their movies/shows
- `Artists.base` - Music artists
- `Restaurants.base` - Restaurant visits
- `Apps.base` - Software applications
- `Emails.base` - Important correspondence
- `Food.base` - Dishes and meals
- `Home.base` - Home page filtered by #home tag
- `Meetings.base` - Meeting history for people
- `Weekly.base` - Weekly summaries
- `Gym.base` - Workout resources
- `GitHub.base` - GitHub repos
- `Articles.base` - Articles with To Read view

These are embedded in notes using `![[filename.base]]`.

## Daily Note Structure

```markdown
---
tags:
  - daily
---

## Journal

[Free-form journaling]

## TODO

- [ ] Tasks for today
- [x] Completed tasks

### Planned

- [ ] Future tasks with context

## Tomorrow

[Tasks to move to next day]

## Notes

[Miscellaneous notes]

![[Daily.base]]
```

## Clipper Templates

Web clipper templates in `.clipper-templates/templates/`:

- See `.clipper-templates/SELECTOR-SYNTAX.md` for selector reference
- Test selectors in browser console before updating templates
- Templates for: GitHub, Goodreads, YouTube, Spotify, IMDB, LinkedIn, etc.

## Content Guidelines for AI Agents

### CRITICAL: File Modification Rules

**NEVER use the Write tool or any command that recreates files.** Obsidian tracks file creation time (ctime) for indexing and queries. If you use Write instead of Edit, or use shell commands like `cat > file` or heredocs, Obsidian will detect the file as newly created, breaking:

- Daily note "Created" views that filter by ctime
- Any base queries using `file.ctime`
- File history and modification tracking

**ALWAYS use the Edit tool** to modify existing files. This preserves the original file's metadata.

### DO:

- Preserve existing frontmatter structure when editing notes
- Use proper Obsidian link syntax `[[]]` for internal references
- Match existing tag conventions (lowercase, hyphenated)
- Create new notes in appropriate folders based on content type
- Use templates when creating new structured notes
- Respect the YYYY-MM-DD date format consistently

### DON'T:

- **USE THE WRITE TOOL ON EXISTING FILES** - This recreates the file and breaks Obsidian's ctime tracking
- Use `cat >`, heredocs, or any shell command that overwrites files - same issue as Write tool
- Modify `.obsidian/` configuration files
- Change `.base` query files without explicit request
- Remove or restructure existing frontmatter fields
- Create duplicate entries without checking existing notes
- Add images directly to root (use Files/ folder)
- Change established naming conventions

### When Creating New Notes:

1. Determine the correct category/folder
2. Use the appropriate template if one exists
3. Fill frontmatter with available information
4. Add proper category links (e.g., `categories: ["[[Books]]"]`)
5. Use consistent date formatting

## Git Configuration

The vault uses git with a whitelist approach:

```gitignore
*                           # Ignore everything by default
!Templates/                 # Except templates
!Templates/**
!Categories/                # Except categories
!Categories/**
!.obsidian/                 # Except Obsidian config
!.obsidian/**
.obsidian/workspace.json    # But ignore workspace state
.obsidian/graph.json        # And graph state
!.clipper-templates/        # Except clipper templates
!.clipper-templates/**
.DS_Store
!.gitignore
```

## Current Projects & Focus Areas

Based on `Home.md`, active areas include:

- Job search (Australia)
- [[LaxDB]] project
- [[Trollycare]]
- [[Running]]
- [[Books]] tracking

## Plugin Ecosystem

The vault uses Obsidian plugins. Key ones based on config:

- Daily Notes (configured for `/Daily/` folder)
- Templater (for template processing)
- Dataview (for `.base` queries)
- ZK Prefixer (for Zettelkasten-style IDs)
- Obsidian Web Clipper (browser extension)

## Working with This Vault

### Reading Notes

- Check frontmatter for metadata
- Look for embedded bases (`![[*.base]]`) for dynamic content
- Follow `[[links]]` to understand relationships

### Modifying Notes

- Preserve existing structure
- Add to appropriate sections
- Update frontmatter dates when relevant

### Creating Notes

- Always check if similar note exists first
- Use correct folder location
- Apply appropriate template
- Set proper categories and tags

## QMD Vault Search

Use `qmd` CLI for semantic search across the vault:

```bash
qmd search "keyword"       # Fast BM25 keyword search
qmd vsearch "concept"      # Semantic vector search
qmd query "question"       # Hybrid + reranking (best quality)
qmd get "Daily/2026-01-15.md"  # Get full document
qmd get "#abc123"          # Get by docid from search results
qmd multi-get "Daily/2026-01*.md"  # Get multiple by glob
```

Options:

- `-n 10` - Number of results
- `-c vault` - Filter to vault collection
- `--min-score 0.3` - Score threshold
- `--json` / `--md` - Output format for processing
- `--full` - Include full document content

Use `qmd query` when searching for concepts or answering questions about vault content.
Use `qmd search` for quick keyword lookups.
