/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  compiler: {
    /* Chakra v3 styles with Emotion. The previous `styledComponents: true` transform
       rewrote the `css` prop into styled-components, which this project never had
       as a dependency. */
    emotion: true,
  },
};
