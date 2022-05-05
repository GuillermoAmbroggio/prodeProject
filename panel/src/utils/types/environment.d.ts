declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      REACT_APP_API_URL: string;
      REACT_APP_API_KEY: string;
    }
  }
}

export {};
