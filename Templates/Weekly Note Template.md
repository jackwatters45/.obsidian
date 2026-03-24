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


## Week Review
- [ ] Non-negotiables: did I protect the cascade? (Sleep → blood sugar → focus → output)
- [ ] [[Standing Orders#The Cut]]: read Standing Orders. What survived, what didn't?
- [ ] Commitments: anything to add, prune, or graduate?
- [ ] Clean up root notes


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
