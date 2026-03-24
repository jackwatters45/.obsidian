<%*
const now = moment();
const currentQuarter = Math.ceil((now.month() + 1) / 3);
const currentYear = now.year();

const nextQuarter = currentQuarter === 4 ? 1 : currentQuarter + 1;
const nextYear = currentQuarter === 4 ? currentYear + 1 : currentYear;

const quarterName = `${nextYear}-Q${nextQuarter}`;
const targetPath = `Quarterly/${quarterName}.md`;

// If next quarter file exists, open it and exit
const existingFile = app.vault.getAbstractFileByPath(targetPath);
if (existingFile) {
  await app.workspace.getLeaf().openFile(existingFile);
  return;
}

const quarterStartMonth = (nextQuarter - 1) * 3;
const startDate = moment({ year: nextYear, month: quarterStartMonth, day: 1 }).format("YYYY-MM-DD");
const endDate = moment({ year: nextYear, month: quarterStartMonth + 2 }).endOf('month').format("YYYY-MM-DD");

const prevQuarter = nextQuarter === 1 ? `${nextYear - 1}-Q4` : `${nextYear}-Q${nextQuarter - 1}`;
const nextNextQuarter = nextQuarter === 4 ? `${nextYear + 1}-Q1` : `${nextYear}-Q${nextQuarter + 1}`;

const content = `---
tags:
  - quarterly
start: ${startDate}
end: ${endDate}
previous: "[[${prevQuarter}]]"
next: "[[${nextNextQuarter}]]"
---

## North Star
*What is the one thing this quarter should move forward?*


## Goals
*3-5 concrete outcomes. If you can't tell whether it happened, it's not a goal.*


## Quarter Review
- [ ] Did I move the north star forward?
- [ ] [[Standing Orders]]: what systems held? What broke?
- [ ] What should I stop, start, or continue?
- [ ] What did I learn?


## Quarter Prep
- [ ] Set next quarter's north star
- [ ] Update [[Standing Orders]] if needed
- [ ] Clean up stale notes and commitments


## Weekly Notes
![[Quarterly.base#Weekly Notes]]

## Notes

`;
const folder = app.vault.getAbstractFileByPath("Quarterly");
await tp.file.create_new(content, quarterName, true, folder);
%>
