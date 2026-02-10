import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const CONTENT_SELECTORS = [
  "article",
  ".post",
  ".content",
  ".post-content",
  ".entry-content",
  ".article-content",
  ".article-body",
  ".story-content",
  ".main-content",
  "main",
];

const DATE_SELECTORS = [
  "meta[property='article:published_time']",
  "meta[name='pubdate']",
  "meta[name='publish-date']",
  "meta[name='date']",
  "time[datetime]",
  "time",
  ".date",
  ".post-date",
  ".entry-date",
  ".article-date",
];

const TITLE_SELECTORS = [
  "meta[property='og:title']",
  "meta[name='twitter:title']",
  "h1",
  "title",
];

const normalizeText = (value) =>
  value.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();

const extractFirstText = ($, selectors) => {
  for (const selector of selectors) {
    const node = $(selector).first();
    if (!node.length) continue;
    const text =
      node.attr("content") || node.attr("datetime") || node.text();
    const normalized = normalizeText(text || "");
    if (normalized) return normalized;
  }
  return "";
};

const extractContent = ($) => {
  for (const selector of CONTENT_SELECTORS) {
    const node = $(selector).first();
    if (!node.length) continue;
    const text = normalizeText(node.text());
    if (text.length > 120) return text;
  }
  return normalizeText($("body").text());
};

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json(
        { error: "URL не указан." },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Не удалось загрузить страницу: ${response.status}` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    $("script, style, noscript").remove();

    const title = extractFirstText($, TITLE_SELECTORS);
    const date = extractFirstText($, DATE_SELECTORS);
    const content = extractContent($);

    return NextResponse.json({ date, title, content });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка парсинга страницы." },
      { status: 500 }
    );
  }
}
