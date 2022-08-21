import path from 'path';
export default {
  contentBase: '',
  port: 24678,
  open: true,
  headers: {
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin'
  },
  // 允许远端访问
  host: '0.0.0.0',
  publicPath: '',
  proxy: {}
};
