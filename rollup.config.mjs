import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/blowfish.ts',
  output: {
    file: 'dist/blowfish.mjs',
  },
  plugins: [
    typescript({
      include: 'src/*',
    }),
  ],
};
