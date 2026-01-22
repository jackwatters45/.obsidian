<%*
const tomorrow = moment().add(1, 'day');
const fileName = tomorrow.format("YYYY-MM-DD");
const targetPath = `Daily/${fileName}.md`;

// If tomorrow's file exists, open it and exit
const existingFile = app.vault.getAbstractFileByPath(targetPath);
if (existingFile) {
  await app.workspace.getLeaf().openFile(existingFile);
  return;
}

// Create new file with template content
const content = `---
tags:
  - daily
---
## Journal


## TODO


### Planned


## Tomorrow


## Notes
![[Daily.base]]

![[Daily.base#Modified]]
`;

const folder = app.vault.getAbstractFileByPath("Daily");
await tp.file.create_new(content, fileName, true, folder);
%>
