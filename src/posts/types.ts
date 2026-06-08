import type { ComponentType, LazyExoticComponent } from 'react';

export interface PostMeta {
  readonly id: string; // slug — matches the post's directory name
  readonly title: string;
  readonly createdAt: string; // "YYYY-MM-DD", set manually, never auto-generated
  readonly abstract: string; // one-paragraph summary shown in the card description slot
  readonly preview: string; // image URL used in CardPreview thumbnail
}

export interface PostDeclaration extends PostMeta {
  readonly Component: LazyExoticComponent<ComponentType>;
}
