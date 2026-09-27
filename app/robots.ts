import { MetadataRoute } from 'next'

// ---------------------------------------------------------------
// Who is allowed to read this site.
//
// Traditional search crawlers (Googlebot, Bingbot) find you through the
// sitemap. AI assistants — ChatGPT, Claude, Perplexity, Gemini — use their
// own crawlers and they are listed explicitly below.
//
// Why be explicit? A few of these bots are aggressive, and a generic
// "block AI bots" rule (now common on news sites) is exactly what makes a
// reference site invisible when someone asks an assistant "what is the IFSC
// code for SBI Main Branch, Dungargarh". Being a factual public dataset,
// we want to be the source they quote.
//
// llms.txt is a plain-text summary that tells these crawlers what the site
// is and which pages matter most, so they do not have to guess.
// ---------------------------------------------------------------

const AI_CRAWLERS = [
  'GPTBot',            // OpenAI — training + ChatGPT browsing
  'OAI-SearchBot',     // OpenAI — ChatGPT search index
  'ChatGPT-User',      // OpenAI — user-triggered fetch
  'ClaudeBot',         // Anthropic — training + Claude search
  'Claude-User',       // Anthropic — user-triggered fetch
  'anthropic-ai',      // Anthropic — legacy
  'PerplexityBot',     // Perplexity
  'Perplexity-User',   // Perplexity — user-triggered
  'Google-Extended',   // Google — Gemini grounding + Vertex AI RAG
  'Applebot-Extended', // Apple Intelligence
  'CCBot',             // Common Crawl — upstream of many AI training sets
  'Bingbot',           // Microsoft — Copilot
  'DuckAssistBot',     // DuckDuckGo AI answers
  'Meta-ExternalAgent',// Meta AI
  'cohere-ai',         // Cohere
  'YouBot',            // You.com
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Traditional search engines.
        userAgent: ['Googlebot', 'Bingbot', 'Googlebot-News'],
        allow: '/',
      },
      {
        // AI assistants. Explicit rather than relying on the wildcard,
        // so the intent is unambiguous and survives future edits to the
        // general rule below.
        userAgent: AI_CRAWLERS,
        allow: '/',
      },
      {
        // No AI scraper benefits from the interactive tools or the
        // dashboard, and they are near-duplicates of the index pages.
        userAgent: AI_CRAWLERS,
        disallow: ['/api/', '/dashboard', '/quiz', '/report'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          // Honeypot paths. No legitimate crawler has any reason to fetch
          // these — the site has no admin panel, no .env on the web, and
          // no WordPress. Disallowing them keeps well-behaved bots out of
          // the trap and out of the blocklist.
          '/admin',
          '/administrator',
          '/panel',
          '/wp-',
          '/phpmyadmin',
          '/xmlrpc.php',
          '/vendor/',
          '/.env',
          '/.git',
          '/.svn',
          '/.hg',
          '/.aws',
          '/.ssh',
          '/.kube',
          '/.htaccess',
          '/cgi-bin',
          '/config.json',
          '/config.php',
          '/Dockerfile',
          '/package.json',
          '/backup',
          '/dump.sql',
          '/database.sql',
        ],
      },
    ],
    sitemap: 'https://multisheets.com/sitemap.xml',
    host: 'https://multisheets.com',
  }
}