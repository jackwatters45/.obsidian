<%\*
const weekMatch = tp.file.title.match(/(\d{4})-W(\d{2})/);
let weekMoment;
if (weekMatch) {
const year = parseInt(weekMatch[1]);
const week = parseInt(weekMatch[2]);
weekMoment = moment().isoWeekYear(year).isoWeek(week);
} else {
weekMoment = moment();
}
const startDate = weekMoment.clone().startOf('isoWeek').format("YYYY-MM-DD");
const endDate = weekMoment.clone().endOf('isoWeek').format("YYYY-MM-DD");
const prevWeek = weekMoment.clone().subtract(1, 'week').format("YYYY-[W]WW");
const nextWeek = weekMoment.clone().add(1, 'week').format("YYYY-[W]WW");
-%>

---

tags:

- weekly
  start: <% startDate %>
  end: <% endDate %>
  previous: "[[<% prevWeek %>]]"
  next: "[[<% nextWeek %>]]"

---

## Journal 


## Goals


## Week Prep
- [ ] Clothers Prep
- [ ] Meal Prep


## Notes


## Daily Notes

![[Weekly.base#Daily Notes]]

## All Entries

![[Weekly.base#All Entries]]
