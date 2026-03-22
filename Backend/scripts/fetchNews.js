/**
 * fetchNews.js
 * Pulls latest tech news from free RSS feeds and saves to MongoDB.
 * Run with: npm run fetch-news  (from Backend/)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Parser = require('rss-parser');
const News = require('../models/News');

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
    ],
  },
});

// Extract image from RSS item using all known locations
function extractImage(item) {
  // 1. media:content or media:thumbnail
  if (item.mediaContent?.$.url) return item.mediaContent.$.url;
  if (item.mediaThumbnail?.$.url) return item.mediaThumbnail.$.url;
  // 2. enclosure (podcasts / some feeds)
  if (item.enclosure?.url && /\.(jpg|jpeg|png|webp|gif)/i.test(item.enclosure.url)) return item.enclosure.url;
  // 3. First <img> tag inside content or content:encoded
  const html = item['content:encoded'] || item.content || '';
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match) return match[1];
  return '';
}

const FEEDS = [
  { url: 'https://techcrunch.com/feed/',                     category: 'Startups'      },
  { url: 'https://www.theverge.com/rss/index.xml',           category: 'Technology'    },
  { url: 'https://www.wired.com/feed/rss',                   category: 'Technology'    },
  { url: 'https://feeds.arstechnica.com/arstechnica/index',  category: 'Science'       },
  { url: 'https://www.technologyreview.com/feed/',           category: 'AI'            },
  { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', category: 'Technology'    },
];

// Map keywords → category
function detectCategory(title = '', content = '') {
  const text = (title + ' ' + content).toLowerCase();
  if (/\b(ai|artificial intelligence|machine learning|llm|gpt|chatgpt|gemini|claude)\b/.test(text)) return 'AI';
  if (/\b(startup|funding|venture|series [a-d]|ipo|acquisition)\b/.test(text)) return 'Startups';
  if (/\b(cybersecurity|hack|breach|malware|ransomware|vulnerability)\b/.test(text)) return 'Cybersecurity';
  if (/\b(science|research|study|nasa|space|climate)\b/.test(text)) return 'Science';
  if (/\b(gadget|iphone|android|smartphone|laptop|hardware|chip)\b/.test(text)) return 'Gadgets';
  if (/\b(software|app|developer|programming|open.?source|github)\b/.test(text)) return 'Software';
  return 'Technology';
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Fetch existing titles to deduplicate
  const existing = new Set(
    (await News.find({}, 'title').lean()).map(n => n.title.trim().toLowerCase())
  );

  let added = 0;
  let skipped = 0;

  for (const feed of FEEDS) {
    try {
      console.log(`📡 Fetching: ${feed.url}`);
      const result = await parser.parseURL(feed.url);

      for (const item of result.items) {
        const title = item.title?.trim();
        if (!title) continue;

        const image = extractImage(item);

        if (existing.has(title.toLowerCase())) {
          // Update image if it was missing before
          if (image) {
            await News.updateOne({ title }, { $set: { image } });
          }
          skipped++;
          continue;
        }

        const content = item.contentSnippet || item.content || item.summary || '';
        const category = detectCategory(title, content) || feed.category;
        const date = item.pubDate
          ? new Date(item.pubDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10);

        await News.create({ title, content, category, date, image });
        existing.add(title.toLowerCase());
        added++;
      }
    } catch (err) {
      console.warn(`⚠️  Failed to fetch ${feed.url}: ${err.message}`);
    }
  }

  console.log(`\n✅ Done — ${added} new articles added, ${skipped} duplicates skipped.`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
