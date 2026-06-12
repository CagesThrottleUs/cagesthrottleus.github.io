import { ProgressBar, ProgressCircle } from '@react-spectrum/s2';
import {
  Content,
  Heading,
  IllustratedMessage,
} from '@react-spectrum/s2/IllustratedMessage';
import NoElements from '@react-spectrum/s2/illustrations/gradient/generic2/NoElements';
import BrowserError from '@react-spectrum/s2/illustrations/linear/BrowserError';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
import { lazy, Suspense, use } from 'react';
import { Route, Routes, useParams } from 'react-router';

import { CommonStyler } from './common/component';
import { PostWrapper } from './pages/Post/component';
import { postsPromise } from './posts/promise';

const HomePage = lazy(() => import('./pages/Home/component'));

const notFoundLayout = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexGrow: 1,
  padding: 48,
});

const loadingLayout = style({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 64,
  paddingX: 32,
});

function PageNotFound() {
  return (
    <div className={notFoundLayout}>
      <IllustratedMessage>
        <BrowserError />
        <Heading>Page not found</Heading>
        <Content>
          This page doesn&apos;t exist. Check the URL or head back home.
        </Content>
      </IllustratedMessage>
    </div>
  );
}

function PostNotFound({ slug }: Readonly<{ slug: string | undefined }>) {
  return (
    <div className={notFoundLayout}>
      <IllustratedMessage>
        <NoElements />
        <Heading>Post not found</Heading>
        <Content>
          {slug !== undefined
            ? `No post exists with the slug "${slug}".`
            : 'This post does not exist.'}
        </Content>
      </IllustratedMessage>
    </div>
  );
}

function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const posts = use(postsPromise);
  const post = posts.find((p) => p.id === slug);

  if (post === undefined) {
    return <PostNotFound slug={slug} />;
  }

  return (
    <PostWrapper>
      <post.Component />
    </PostWrapper>
  );
}

const loadingFallback = (
  <div className={loadingLayout}>
    <ProgressBar isIndeterminate aria-label="Loading" />
  </div>
);

export default function AppRoutes() {
  return (
    <CommonStyler>
      <Suspense
        fallback={<ProgressCircle aria-label="Loading" isIndeterminate />}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={loadingFallback}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/posts/:slug"
            element={
              <Suspense fallback={loadingFallback}>
                <PostPage />
              </Suspense>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </CommonStyler>
  );
}
