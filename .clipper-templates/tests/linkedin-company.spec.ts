import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { extractValue, getTestableProperties, hasValue, loadTemplate } from "./clipper-helper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_URL = "https://www.linkedin.com/company/example/";
const template = loadTemplate("linkedin-company-clipper");

test.describe("LinkedIn Company Clipper", () => {
  test("extracts all template properties", async ({ page }) => {
    // Serve local HTML fixture
    await page.route(TEST_URL, async (route) => {
      const filePath = path.join(__dirname, "fixtures", "linkedin-company.html");
      const html = fs.readFileSync(filePath, "utf-8");
      await route.fulfill({ body: html, contentType: "text/html" });
    });

    await page.goto(TEST_URL, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    for (const prop of getTestableProperties(template)) {
      const value = await extractValue(page, prop);
      expect(hasValue(value), `${prop.name}: ${prop.value}`).toBe(true);
    }
  });
});
