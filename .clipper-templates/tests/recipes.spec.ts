import { expect, test } from "@playwright/test";
import { extractValue, getTestableProperties, hasValue, loadTemplate } from "./clipper-helper";

const TEST_URL = "https://houseofnasheats.com/brazilian-lemonade-limeade/";
const template = loadTemplate("recipes-clipper");

test.describe("Recipes Clipper", () => {
  test("extracts all template properties", async ({ page }) => {
    await page.goto(TEST_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    for (const prop of getTestableProperties(template)) {
      // publisher not in houseofnasheats.com schema
      if (prop.name === "publisher") continue;

      const value = await extractValue(page, prop);
      expect(hasValue(value), `${prop.name}: ${prop.value}`).toBe(true);
    }
  });
});
