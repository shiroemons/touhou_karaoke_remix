import algoliasearch from 'algoliasearch/lite.js';
import { createFetchRequester } from '@algolia/requester-fetch';

// 環境変数からAlgoliaの設定を取得
const applicationId = process.env.APPLICATION_ID || "";
const apiKey = process.env.API_KEY || "";

// Algoliaの検索クライアントを作成
const searchClient = algoliasearch(applicationId, apiKey, {
  requester: createFetchRequester(), // ここには適切なfetchリクエスターを配置してください
});

export default searchClient;