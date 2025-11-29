#!/usr/bin/env python3
"""
Blog Manifest Generator

Scans MDX blog posts and generates paginated manifest files.
Extracts frontmatter metadata and creates index for efficient loading.
"""

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import TypedDict

# Configuration
POSTS_DIR = Path("posts")
MANIFESTS_DIR = Path("manifests")
METADATA_DIR = MANIFESTS_DIR / "metadata"
POSTS_PER_PAGE = 50


class PostMetadata(TypedDict):
    """Type definition for blog post metadata."""
    slug: str
    title: str
    classification: str
    abstract: str
    publishDate: str
    version: str
    thumbnail: str


def extract_frontmatter(mdx_content: str) -> dict[str, str]:
    """
    Extract YAML frontmatter from MDX file.

    Args:
        mdx_content: Content of the MDX file

    Returns:
        Dictionary of frontmatter key-value pairs
    """
    match = re.match(r"^---\n(.*?)\n---", mdx_content, re.DOTALL)
    if not match:
        return {}

    frontmatter: dict[str, str] = {}
    for line in match.group(1).split("\n"):
        if ":" in line:
            key, value = line.split(":", 1)
            # Remove quotes and whitespace
            frontmatter[key.strip()] = value.strip().strip("\"'")
    return frontmatter


def get_post_metadata(mdx_file: Path) -> PostMetadata | None:
    """
    Extract metadata from an MDX file.

    Args:
        mdx_file: Path to the MDX file

    Returns:
        Dictionary containing post metadata, or None if invalid
    """
    try:
        with open(mdx_file, "r", encoding="utf-8") as f:
            content = f.read()

        frontmatter = extract_frontmatter(content)
        slug = mdx_file.stem  # Filename without extension

        # Parse date from slug (YYYY-MM-DD-title format)
        date_match = re.match(r"^(\d{4}-\d{2}-\d{2})", slug)
        publish_date = (
            date_match.group(1) if date_match else frontmatter.get("publishDate", "")
        )

        # Validate required fields
        if not frontmatter.get("title"):
            print(f"  [WARN] {slug} missing title")
            return None

        return PostMetadata(
            slug=slug,
            title=frontmatter.get("title", "Untitled"),
            classification=frontmatter.get("classification", "UNCLASSIFIED"),
            abstract=frontmatter.get("abstract", ""),
            publishDate=publish_date,
            version=frontmatter.get("version", "1.0"),
            thumbnail=frontmatter.get("thumbnail", "thumbnails/default.svg"),
        )
    except Exception as e:
        print(f"  [ERROR] Error processing {mdx_file}: {e}")
        return None


def generate_manifests():
    """Generate paginated manifests from MDX files."""
    print("=" * 60)
    print("Blog Manifest Generator")
    print("=" * 60)
    print()

    # Ensure directories exist
    MANIFESTS_DIR.mkdir(parents=True, exist_ok=True)
    METADATA_DIR.mkdir(parents=True, exist_ok=True)

    # Get all MDX files
    if not POSTS_DIR.exists():
        print(f"[ERROR] Posts directory not found: {POSTS_DIR}")
        return

    mdx_files = sorted(POSTS_DIR.glob("*.mdx"), reverse=True)  # Newest first
    print(f"[INFO] Found {len(mdx_files)} MDX file(s)")
    print()

    # Extract metadata from all posts
    all_posts: list[PostMetadata] = []
    for mdx_file in mdx_files:
        metadata = get_post_metadata(mdx_file)
        if metadata:
            all_posts.append(metadata)

            # Save individual metadata file
            metadata_file = METADATA_DIR / f'{metadata["slug"]}.json'
            with open(metadata_file, "w", encoding="utf-8") as f:
                json.dump(metadata, f, indent=2)
            print(f"  [OK] {metadata['slug']}")

    if not all_posts:
        print()
        print("[WARN] No valid posts found")
        return

    print()
    print(f"[OK] Processed {len(all_posts)} post(s)")
    print()

    # Sort by date (newest first)
    all_posts.sort(key=lambda p: p["publishDate"], reverse=True)

    # Generate paginated manifests
    total_pages = (len(all_posts) + POSTS_PER_PAGE - 1) // POSTS_PER_PAGE
    print(f"[INFO] Generating {total_pages} page(s)...")

    for page_num in range(1, total_pages + 1):
        start_idx = (page_num - 1) * POSTS_PER_PAGE
        end_idx = min(start_idx + POSTS_PER_PAGE, len(all_posts))
        page_posts = all_posts[start_idx:end_idx]

        page_manifest = {"page": page_num, "posts": page_posts}

        page_file = MANIFESTS_DIR / f"page-{page_num}.json"
        with open(page_file, "w", encoding="utf-8") as f:
            json.dump(page_manifest, f, indent=2)
        print(f"  [OK] page-{page_num}.json ({len(page_posts)} posts)")

    # Generate index manifest
    index = {
        "version": datetime.now(timezone.utc).isoformat(),
        "totalPosts": len(all_posts),
        "totalPages": total_pages,
        "postsPerPage": POSTS_PER_PAGE,
        "latestPosts": all_posts[:10],  # 10 most recent for preview
        "pages": {
            str(i): f"manifests/page-{i}.json" for i in range(1, total_pages + 1)
        },
    }

    index_file = MANIFESTS_DIR / "index.json"
    with open(index_file, "w", encoding="utf-8") as f:
        json.dump(index, f, indent=2)

    print()
    print("[OK] Generated index.json")
    print()
    print("=" * 60)
    print(f"[SUCCESS] Complete! {len(all_posts)} posts across {total_pages} page(s)")
    print("=" * 60)


if __name__ == "__main__":
    generate_manifests()
