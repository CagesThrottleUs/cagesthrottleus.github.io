import { Keyboard, ToastQueue } from '@react-spectrum/s2';
import { ActionMenu, MenuItem } from '@react-spectrum/s2/ActionMenu';
import {
  Card,
  CardPreview,
  CardView,
  Content,
  Footer,
  Image,
  SkeletonCollection,
  Text,
} from '@react-spectrum/s2/CardView';
import Copy from '@react-spectrum/s2/icons/Copy';
import {
  Content as ILContent,
  Heading,
  IllustratedMessage,
} from '@react-spectrum/s2/IllustratedMessage';
import NoElements from '@react-spectrum/s2/illustrations/gradient/generic2/NoElements';
import { Skeleton } from '@react-spectrum/s2/Skeleton';
import { StatusLight } from '@react-spectrum/s2/StatusLight';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
import { Suspense, use } from 'react';

import { postsPromise } from '../../posts/promise';
import type { PostDeclaration } from '../../posts/types';

const PREVIEW_HEIGHT = 200;

const emptyLayout = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexGrow: 1,
  paddingY: 64,
});

function PostCard({ post }: Readonly<{ post: PostDeclaration }>) {
  const shareUrl = `${window.location.origin}/#/posts/${post.id}`;

  return (
    <Card
      id={post.id}
      href={`/posts/${post.id}`}
      textValue={post.title}
      size="XL"
      variant="primary"
      density="spacious"
    >
      <CardPreview>
        <Image
          alt={post.title}
          src={post.preview}
          styles={style({
            width: 'full',
            height: PREVIEW_HEIGHT,
            objectFit: 'cover',
          })}
        />
      </CardPreview>
      <Content>
        <Text slot="title">{post.title}</Text>
        <ActionMenu>
          <MenuItem
            textValue="Copy"
            onAction={async () => {
              await navigator.clipboard.writeText(shareUrl);
              ToastQueue.neutral('Link copied to clipboard', { timeout: 5000 });
            }}
          >
            <Copy />
            <Text slot="label">Copy</Text>
            <Text slot="description">Copy link to share</Text>
            <Keyboard>⌘C</Keyboard>
          </MenuItem>
        </ActionMenu>
        <Text slot="description">{post.abstract}</Text>
      </Content>
      <Footer>
        <StatusLight variant="positive" size="S">
          Published
        </StatusLight>
      </Footer>
    </Card>
  );
}

function PostCardSkeleton() {
  return (
    <Skeleton isLoading>
      <Card textValue="Loading" size="XL" variant="primary" density="spacious">
        <CardPreview>
          <Image
            alt=""
            src=""
            styles={style({ width: 'full', height: PREVIEW_HEIGHT })}
          />
        </CardPreview>
        <Content>
          <Text slot="title">Loading post title</Text>
          <Text slot="description">Loading post description...</Text>
        </Content>
        <Footer>
          <StatusLight variant="positive" size="S">
            Published
          </StatusLight>
        </Footer>
      </Card>
    </Skeleton>
  );
}

function HomePageGrid() {
  const posts = use(postsPromise);

  if (posts.length === 0) {
    return (
      <div className={emptyLayout}>
        <IllustratedMessage>
          <NoElements />
          <Heading>No posts yet</Heading>
          <ILContent>Check back soon for new articles.</ILContent>
        </IllustratedMessage>
      </div>
    );
  }

  return (
    <CardView
      aria-label="Blog posts"
      layout="waterfall"
      size="XL"
      variant="primary"
      density="compact"
      items={posts}
    >
      {(post) => <PostCard post={post} />}
    </CardView>
  );
}

function HomePageSkeleton() {
  return (
    <CardView
      aria-label="Loading blog posts"
      layout="waterfall"
      size="XL"
      variant="primary"
      density="compact"
    >
      <SkeletonCollection>{() => <PostCardSkeleton />}</SkeletonCollection>
    </CardView>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageGrid />
    </Suspense>
  );
}
