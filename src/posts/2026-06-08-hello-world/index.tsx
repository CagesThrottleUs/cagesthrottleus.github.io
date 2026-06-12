import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

const postLayout = style({
  maxWidth: 768,
  marginX: 'auto',
  paddingY: 48,
  paddingX: 24,
});

export default function HelloWorldPost() {
  return (
    <article className={postLayout}>
      <h1>Hello World</h1>
      <p>
        This is the first post. Replace this content with the real article body.
      </p>
    </article>
  );
}
