declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NOTION_KEY: string;
      DATABASE_ID: string;
      PORT: number;
    }
  }
}

export {};