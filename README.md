# iGram Instagram Downloader

A full-stack, responsive web application for extracting and downloading publicly available Instagram Reels, Videos, and Photos in original quality without watermarks.

---

## 1. Project Overview & Features

- **Live URL Extraction**: Resolves direct MP4 video streams and high-resolution JPEG photos from public Instagram URLs.
- **In-Browser Preview**: Inline HTML5 video playback with responsive aspect ratio (9:16 and 1:1) before downloading.
- **Direct & Proxy Downloads**: Support for direct downloads and secure server-side streaming proxy (`/api/download-stream`) to prevent CORS and browser download issues.
- **Security & SSRF Hardening**: Strict domain verification, IP filtering against local/private addresses, sanitized headers, and rate limiting.
- **Zero Registration & Passwordless**: Never asks for user passwords, cookies, or account access.
- **Automated Test Suite**: Comprehensive tests validating URL parsing, SSRF prevention, live provider extraction, and error handling.

---

## 2. Research: Free Extraction Providers

We investigated the two requested services:

### A. WeirdDL (`https://weirddl.sbs/`) — **Selected Primary Provider**
- **Documentation & Endpoints**:
  - `GET /api/health` — Returns status and available endpoints.
  - `GET /api/info?url=<URL>` — Fetches rich metadata and media URLs.
  - `POST /api/batch` — Batch processing endpoint.
  - `GET /api/download?url=<URL>` — Attachment download proxy.
- **API Key Required**: **No**. Publicly accessible without authentication.
- **Response Speed**: Very fast (~2 to 4 seconds).
- **Metadata Returned**: Complete author handle, caption, resolution, duration, audio flag, thumbnail URL, and direct CDN download URL.
- **Permissions & Terms**: Documentation specifies personal use and respect for creators and platform ToS. Self-regulated rate limits.
- **Verification Status**: **VERIFIED & WORKING**. Successfully tested with live public Instagram Reels.

### B. AllDL by AHM7 (`https://ahm7xmakki.com/alldl`) — **Fallback Provider**
- **Endpoint**: `GET /api/alldl?url=<URL>`
- **API Key Required**: **No**.
- **Response Speed**: Slower (~10 to 14 seconds).
- **Caveats**: Relies on third-party `rapidcdn.app` JWT redirect tokens and injects promotional links in JSON responses.
- **Status**: Configured as an automatic fallback if the primary provider is unreachable.

---

## 3. Project File Structure

```
├── .env.example                  # Environment configuration template
├── index.html                    # SEO-optimized HTML entry point with JSON-LD
├── metadata.json                 # AI Studio app metadata
├── package.json                  # Dependencies and scripts (Express + Vite + tsx)
├── server.ts                     # Full-stack Express server mounting APIs and Vite
├── src/
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Tailwind CSS v4 styling & typography
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── App.tsx                   # Main React component
│   ├── components/
│   │   ├── Header.tsx            # Navigation bar and logo
│   │   ├── DownloaderHero.tsx    # Primary URL input, paste/clear controls, and errors
│   │   ├── ResultCard.tsx        # Video player, media metadata, and download triggers
│   │   ├── HowToSection.tsx      # Step-by-step guides for Videos and Reels
│   │   ├── FeaturesSection.tsx   # Core features grid
│   │   ├── SupportedContentSection.tsx # Supported vs unsupported matrix
│   │   ├── FaqSection.tsx        # Accordion with all 8 specified questions
│   │   ├── LegalModals.tsx       # Privacy, Terms, DMCA, and Contact modals
│   │   └── Footer.tsx            # Footer navigation and Meta disclaimer
│   ├── server/
│   │   ├── validation.ts         # Zod schemas, URL sanitization & SSRF guards
│   │   ├── rateLimiter.ts        # Sliding-window IP rate limiter
│   │   ├── proxy.ts              # Secure media streaming proxy with domain whitelist
│   │   └── providers/
│   │       ├── weirddl.ts        # Primary WeirdDL client
│   │       └── alldl.ts          # Fallback AllDL client
│   └── test/
│       └── runTests.ts           # Automated test suite
└── public/
    ├── robots.txt                # Search engine crawler instructions
    └── sitemap.xml               # XML sitemap for SEO
```

---

## 4. API Specification

### `POST /api/extract`
Extracts media information for a given Instagram URL.
- **Request Body**:
  ```json
  {
    "url": "https://www.instagram.com/reel/DUtY_OyjMwq/"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "media": {
      "id": "DUtY_OyjMwq",
      "type": "video",
      "title": "try your speed test reaction ...",
      "author": "@call_me_dolan",
      "thumbnailUrl": "https://scontent-....cdninstagram.com/...",
      "downloadUrl": "https://scontent-....cdninstagram.com/...mp4",
      "downloadExt": "mp4",
      "duration": 5.22,
      "width": 640,
      "height": 1136,
      "hasAudio": true,
      "mediaList": [...],
      "provider": "weirddl",
      "extractedAt": "2026-10-25T10:04:22.000Z"
    }
  }
  ```
- **Error Response (400 / 422 / 429)**:
  ```json
  {
    "success": false,
    "error": "Descriptive reason for failure",
    "code": "invalid_url"
  }
  ```

### `GET /api/health`
Checks server and upstream provider status.
- **Response**:
  ```json
  {
    "status": "healthy",
    "service": "iGram Instagram Downloader API",
    "primaryProvider": "weirddl",
    "providers": {
      "weirddl": { "configured": true, "health": "connected" },
      "alldl": { "configured": true, "health": "ready" }
    }
  }
  ```

### `GET /api/download-stream?url=<URL>&filename=<FILENAME>`
Securely streams media from allowed CDN domains with `Content-Disposition: attachment` to force file download in browsers without CORS errors.

---

## 5. Security & Reliability

1. **SSRF Protection**: URL hostnames are validated against an allowlist (`instagram.com`, `instagr.am`). Localhost and private IP addresses are rejected before any network request is issued.
2. **Download Proxy Whitelist**: The `/api/download-stream` endpoint strictly allows only official Instagram and Facebook CDN hostnames (`*.cdninstagram.com`, `*.fbcdn.net`, `d.rapidcdn.app`, `weirddl.sbs`).
3. **Rate Limiting**: IP-based rate limiting (20 requests per minute) prevents abuse.
4. **No Secrets in Bundles**: All provider configurations and network requests are executed server-side.

---

## 6. How to Run & Deploy

### Development
```bash
npm run dev
```
Starts the full-stack server on port `3000` with Express and Vite middleware.

### Run Automated Tests
```bash
npm test
```
Executes all 14 unit and integration tests against URL validation, SSRF filters, and live provider extraction.

### Production Build
```bash
npm run build
npm start
```
Compiles Vite frontend assets to `dist/` and starts Express in production mode.
