import { expect, test } from "@playwright/test";
import { extractValue, getTestableProperties, hasValue, loadTemplate } from "./clipper-helper";

const TEST_URL = "https://www.goodreads.com/book/show/5107.The_Catcher_in_the_Rye";
const template = loadTemplate("goodreads-clipper");

test.describe("Goodreads Clipper", () => {
  test("extracts all template properties", async ({ page }) => {
    await page.goto(TEST_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    for (const prop of getTestableProperties(template)) {
      const value = await extractValue(page, prop);
      expect(hasValue(value), `${prop.name}: ${prop.value}`).toBe(true);
    }
  });
});
