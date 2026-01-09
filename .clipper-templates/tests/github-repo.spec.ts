import { expect, test } from "@playwright/test";
import { extractValue, getTestableProperties, hasValue, loadTemplate } from "./clipper-helper";

const TEST_URL = "https://github.com/ChromeDevTools/chrome-devtools-mcp";
const template = loadTemplate("github-repo-clipper");

test.describe("GitHub Repo Clipper", () => {
  test("extracts all template properties", async ({ page }) => {
    await page.goto(TEST_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    for (const prop of getTestableProperties(template)) {
      const value = await extractValue(page, prop);
      expect(hasValue(value), `${prop.name}: ${prop.value}`).toBe(true);
    }
  });
});
