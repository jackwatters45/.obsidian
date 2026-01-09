import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { extractValue, getTestableProperties, hasValue, loadTemplate } from "./clipper-helper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_URL = "https://x.com/example/article/123456789";
const template = loadTemplate("x-(twitter)-article-clipper");

test.describe("Twitter Article Clipper", () => {
  test("extracts all template properties", async ({ page }) => {
    // Serve local HTML fixture
    await page.route(TEST_URL, async (route) => {
      const filePath = path.join(__dirname, "fixtures", "twitter-article.html");
      const html = fs.readFileSync(filePath, "utf-8");
      await route.fulfill({ body: html, contentType: "text/html" });
    });

    await page.goto(TEST_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    for (const prop of getTestableProperties(template)) {
      // Skip complex selectors that use template syntax the test helper can't parse
      if (prop.type === "selector" && (prop.value.includes(":has(") || prop.value.includes("|wikilink"))) continue;
      // Skip title - requires capturing early before context destruction
      if (prop.value === "{{title}}") continue;
      
      const value = await extractValue(page, prop);
      expect(hasValue(value), `${prop.name}: ${prop.value}`).toBe(true);
    }
  });
});
