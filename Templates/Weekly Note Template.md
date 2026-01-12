<%*
const weekMoment = moment();
const weekFileName = weekMoment.format("GGGG-[W]WW");
const targetPath = `Weekly/${weekFileName}.md`;

// If current week file exists, open it and exit
const existingFile = app.vault.getAbstractFileByPath(targetPath);
if (existingFile) {
  await app.workspace.getLeaf().openFile(existingFile);
  return;
}

// If we're already on the target file, just continue with template
// Otherwise create new file
if (tp.file.path !== targetPath) {
  const startDate = weekMoment.clone().startOf('isoWeek').format("YYYY-MM-DD");
  const endDate = weekMoment.clone().endOf('isoWeek').format("YYYY-MM-DD");
  const prevWeek = weekMoment.clone().subtract(1, 'week').format("GGGG-[W]WW");
  const nextWeek = weekMoment.clone().add(1, 'week').format("GGGG-[W]WW");

  const content = `---
tags:
  - weekly
start: ${startDate}
end: ${endDate}
previous: "[[${prevWeek}]]"
next: "[[${nextWeek}]]"
---

## Journal


## Goals


## Week Prep
- [ ] Clothes Prep
- [ ] Meal Prep


## Notes


## Daily Notes

![[Weekly.base#Daily Notes]]

## All Entries
![[Weekly.base#All Entries]]
`;
  const folder = app.vault.getAbstractFileByPath("Weekly");
  await tp.file.create_new(content, weekFileName, true, folder);
}
%>
