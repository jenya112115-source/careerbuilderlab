# Career Builder Lab

Production-ready Jekyll website for GitHub Pages. The site is built as a static, editable expert platform for Career Builder Lab and Євгеній Гребіненко.

## Structure

```text
_config.yml
_data/
  brand.yml
  navigation.yml
  locales.yml
_includes/
_layouts/
_posts/
_resources/
_services/
assets/
  css/main.css
  js/main.js
  images/profile-placeholder.svg
pages/
CNAME
robots.txt
```

## Run Locally

Install Ruby and Bundler, then run:

```bash
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000`.

### Windows Note For This Workspace

This local workspace used RubyInstaller 3.3 with the GitHub Pages gem. If `bundle exec jekyll build` fails on Windows because of Jekyll 3.x/Ruby 3.3 loading issues, use:

```powershell
$env:BUNDLE_USER_HOME = (Join-Path $PWD '.bundle-user')
$env:GEM_SPEC_CACHE = (Join-Path $PWD '.gem-spec-cache')
bundle exec ruby scripts/jekyll_build.rb
```

To preview the generated `_site` folder with the included static server:

```powershell
C:\Users\omdxc\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe scripts\static_server.mjs 4000
```

Open `http://127.0.0.1:4000`.

## Deploy To GitHub Pages

1. Push this folder to a GitHub repository.
2. In repository settings, open `Pages`.
3. Select deployment from the main branch, or use GitHub Pages defaults.
4. GitHub Pages will use the `github-pages` gem from `Gemfile`.
5. Update `url` in `_config.yml` when the final domain is known.

## Add A Blog Post

Create a Markdown file in `_posts` using this format:

```text
YYYY-MM-DD-post-slug.md
```

Example front matter:

```yaml
---
title: "Назва статті"
description: "Короткий SEO-опис статті."
category: "LinkedIn"
tags: ["LinkedIn", "контент"]
reading_time: "5 хв читання"
---
```

Write the article below the front matter in Markdown.

## Add A Free Resource

Create a Markdown file in `_resources`.

```yaml
---
title: "Назва матеріалу"
description: "Короткий опис."
type: "Гайд"
order: 5
cta_url: "https://t.me/your_channel_placeholder"
---
```

The `order` field controls display order. Replace `cta_url` with the real Telegram or download link.

## Add A Service

Create a Markdown file in `_services`.

```yaml
---
title: "Назва послуги"
description: "Короткий опис результату."
price: "10000 грн"
format: "Формат роботи"
order: 6
---
```

The service page is generated automatically at `/services/file-name/`.

## Replace The Profile Image

1. Add the final image to `assets/images/`.
2. Update `profile_image` in `_data/brand.yml`.
3. Keep the image optimized. Recommended ratio: `4:5`.

## Add Material/Product Images

Use:

- `assets/images/materials/` for free material covers or previews.
- `assets/images/products/` for premium product covers or mockups.
- `assets/images/experiments/` for experiment visuals.

Then add `card_image: "/assets/images/materials/file-name.jpg"` or `card_image: "/assets/images/products/file-name.jpg"` to the relevant Markdown front matter.

## Change Links

Edit `_data/brand.yml`:

- `linkedin`
- `telegram`
- `booking`
- `google_form`
- `email`

The contact page and CTA areas use these values automatically.

## Custom Domain And CNAME

`CNAME` currently contains `example.com` as a placeholder. Before enabling a custom domain:

1. Replace `example.com` with the real domain.
2. Configure DNS records in your domain provider.
3. Add the same domain in GitHub Pages settings.
4. Update `url` in `_config.yml`.

If no custom domain is used yet, remove the `CNAME` file before deploying.

## Localization Readiness

The active language is Ukrainian. Future localization can be added by extending `_data/locales.yml`, creating localized navigation data, and introducing language-specific page folders or collections.

## Editing Notes

- Main visible strings live in pages, collection Markdown files, and `_data`.
- Theme colors and layout rules live in `assets/css/main.css`.
- Theme toggle and mobile navigation live in `assets/js/main.js`.
- SEO metadata is provided through page front matter and `jekyll-seo-tag`.
