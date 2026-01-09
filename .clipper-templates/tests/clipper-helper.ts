import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { Page } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ClipperTemplate {
  schemaVersion: string;
  name: string;
  behavior: string;
  noteContentFormat: string;
  properties: Array<{
    name: string;
    value: string;
    type: string;
  }>;
  triggers: string[];
  noteNameFormat: string;
  path: string;
}

export interface TestableProperty {
  name: string;
  value: string;
  type: "schema" | "selector" | "selectorHtml" | "meta" | "url";
  selector?: string;
  attribute?: string;
  schemaPath?: string;
}

export function loadTemplate(templateName: string): ClipperTemplate {
  const templatePath = path.join(__dirname, "..", "templates", `${templateName}.json`);
  return JSON.parse(fs.readFileSync(templatePath, "utf-8"));
}

export function getTestableProperties(template: ClipperTemplate): TestableProperty[] {
  const results: TestableProperty[] = [];
  const seen = new Set<string>();

  function addProperty(name: string, value: string) {
    if (!value || seen.has(value)) return;

    const parsed = parseValue(value);
    if (parsed) {
      seen.add(value);
      results.push({ name, value, ...parsed });
    }
  }

  function extractExpressions(str: string): string[] {
    if (!str) return [];
    return str.match(/\{\{[^}]+\}\}/g) || [];
  }

  for (const expr of extractExpressions(template.noteNameFormat)) {
    addProperty("noteNameFormat", expr);
  }

  for (const expr of extractExpressions(template.noteContentFormat)) {
    addProperty("noteContentFormat", expr);
  }

  for (const prop of template.properties) {
    const exprs = extractExpressions(prop.value);
    if (exprs.length > 0) {
      for (const expr of exprs) {
        addProperty(prop.name, expr);
      }
    }
  }

  return results;
}

function parseValue(value: string): Omit<TestableProperty, "name" | "value"> | null {
  const runtimeOnly = ["{{date}}", "{{time}}", "{{published}}", "{{content}}"];
  if (runtimeOnly.includes(value)) return null;

  const schemaMatch = value.match(/^\{\{schema:([^|}]+)/);
  if (schemaMatch) {
    const schemaPath = schemaMatch[1]!.replace(/\[\*\]/g, "");
    return { type: "schema", schemaPath };
  }

  const selectorMatch = value.match(/^\{\{selector:(.+?)(?:\||$|\}\})/);
  if (selectorMatch) {
    const selector = selectorMatch[1]!;
    const { selector: sel, attribute } = parseSelector(selector);
    return { type: "selector", selector: sel, attribute };
  }

  const selectorHtmlMatch = value.match(/^\{\{selectorHtml:([^|}]+)/);
  if (selectorHtmlMatch) {
    return { type: "selectorHtml", selector: selectorHtmlMatch[1] };
  }

  if (value === "{{url}}") {
    return { type: "url" };
  }

  if (value === "{{title}}") {
    return { type: "meta", selector: "title" };
  }

  if (value === "{{description}}") {
    return { type: "meta", selector: 'meta[name="description"]', attribute: "content" };
  }

  return null;
}

function parseSelector(raw: string): { selector: string; attribute?: string } {
  const selector = raw.replace(/\\"/g, '"');

  const questionMatch = selector.match(/^(.+)\?(\w+)$/);
  if (questionMatch) {
    return { selector: questionMatch[1]!, attribute: questionMatch[2] };
  }

  const hrefMatch = selector.match(/^(.+):href$/);
  if (hrefMatch) {
    return { selector: hrefMatch[1]!, attribute: "href" };
  }

  const metaContentMatch = selector.match(/^(meta\[[^\]]+\]):(\w+)$/);
  if (metaContentMatch) {
    return { selector: metaContentMatch[1]!, attribute: metaContentMatch[2] };
  }

  const ariaLabelMatch = selector.match(/^(.+):aria-label$/);
  if (ariaLabelMatch) {
    return { selector: ariaLabelMatch[1]!, attribute: "aria-label" };
  }

  return { selector };
}

export async function extractValue(page: Page, prop: TestableProperty): Promise<string | null> {
  switch (prop.type) {
    case "url":
      return page.url();

    case "meta":
      if (prop.selector === "title") {
        return page.title();
      }
      return extractSelector(page, prop.selector!, prop.attribute);

    case "schema":
      return extractSchema(page, prop.schemaPath!);

    case "selector":
    case "selectorHtml":
      return extractSelector(page, prop.selector!, prop.attribute);
  }
}

async function extractSelector(page: Page, selector: string, attribute?: string): Promise<string | null> {
  return page.evaluate(({ sel, attr }) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    if (attr) return el.getAttribute(attr);
    return el.textContent?.trim() || null;
  }, { sel: selector, attr: attribute });
}

async function extractSchema(page: Page, schemaPath: string): Promise<string | null> {
  return page.evaluate((path) => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));

    for (const script of scripts) {
      try {
        let text = script.textContent || "";
        text = text.replace(/\/\* <!\[CDATA\[ \*\/\n?/, "").replace(/\n?\/\* \]\]> \*\//, "");
        const data = JSON.parse(text);
        
        // Collect all items to search: top-level array, @graph array, or single object
        const items: unknown[] = [];
        if (Array.isArray(data)) {
          items.push(...data);
        } else if (data && typeof data === "object") {
          if (Array.isArray(data["@graph"])) {
            items.push(...data["@graph"]);
          } else {
            items.push(data);
          }
        }

        for (const item of items) {
          if (!item || typeof item !== "object") continue;
          const itemRecord = item as Record<string, unknown>;
          const target = item;
          let targetPath = path;

          if (path.startsWith("@")) {
            const colonIdx = path.indexOf(":", 1);
            if (colonIdx > 0) {
              const typeName = path.slice(1, colonIdx);
              targetPath = path.slice(colonIdx + 1);
              const itemType = itemRecord["@type"];
              if (itemType !== typeName && typeof itemType === "string" && !itemType.includes(typeName)) continue;
            } else {
              const typeName = path.slice(1);
              const itemType = itemRecord["@type"];
              if (itemType === typeName || (typeof itemType === "string" && itemType.includes(typeName))) {
                return JSON.stringify(item);
              }
              continue;
            }
          }

          const keys = targetPath.split(".");
          let value: unknown = target;
          
          for (const key of keys) {
            if (Array.isArray(value)) value = value[0];
            const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
            const actualKey = arrayMatch ? arrayMatch[1]! : key;
            const arrayIndex = arrayMatch ? parseInt(arrayMatch[2]!, 10) : null;
            
            if (value && typeof value === "object" && actualKey in value) {
              value = (value as Record<string, unknown>)[actualKey];
              if (arrayIndex !== null && Array.isArray(value)) {
                value = value[arrayIndex];
              }
            } else {
              value = undefined;
              break;
            }
          }

          if (value !== undefined) {
            return typeof value === "object" ? JSON.stringify(value) : String(value);
          }
        }
      } catch {
      }
    }
    return null;
  }, schemaPath);
}

export function hasValue(value: string | null): boolean {
  return value !== null && value.trim().length > 0;
}

export function extractMetaFromHtml(html: string, property: string, isName = false): string | null {
  const attr = isName ? "name" : "property";
  const patterns = [
    new RegExp(`<meta\\s+${attr}=["']${property}["']\\s+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+${attr}=["']${property}["']`, "i"),
  ];
  for (const p of patterns) {
    const match = html.match(p);
    if (match) return match[1] ?? null;
  }
  return null;
}
