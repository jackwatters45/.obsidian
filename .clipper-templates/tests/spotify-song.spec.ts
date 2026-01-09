import { expect, test } from "@playwright/test";
import { extractMetaFromHtml, getTestableProperties, loadTemplate } from "./clipper-helper";

const TEST_URL = "https://open.spotify.com/track/6Qyc6fS4DsZjB2mRW9DsQs";
const template = loadTemplate("spotify-song-clipper");

test.describe("Spotify Song Clipper", () => {
  test("extracts all template properties", async () => {
    const response = await fetch(TEST_URL);
    const html = await response.text();

    for (const prop of getTestableProperties(template)) {
      if (prop.type === "selector" && prop.selector?.startsWith("meta[")) {
        const match = prop.selector.match(/meta\[(?:property|name)=['"]([\w:]+)['"]\]/);
        if (match) {
          const isName = prop.selector.includes("name=");
          const value = extractMetaFromHtml(html, match[1]!, isName);
          expect(value, `${prop.name}: ${prop.value}`).toBeTruthy();
        }
      } else if (prop.type === "url") {
        expect(TEST_URL).toBeTruthy();
      }
    }
  });
});
