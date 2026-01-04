<%*
const monthMatch = tp.file.title.match(/(\d{4})-(\d{2})/);
let monthMoment;
if (monthMatch) {
  const year = parseInt(monthMatch[1]);
  const month = parseInt(monthMatch[2]);
  monthMoment = moment().year(year).month(month - 1);
} else {
  monthMoment = moment();
}
const alias = monthMoment.format("MMMM YYYY");
const prevMonth = monthMoment.clone().subtract(1, 'month').format("YYYY-MM");
const nextMonth = monthMoment.clone().add(1, 'month').format("YYYY-MM");
-%>
---
aliases:
  - <% alias %>
previous: "[[<% prevMonth %>]]"
next: "[[<% nextMonth %>]]"
tags:
  - monthly
---

## Entries

![[Daily.base#Monthly]]
