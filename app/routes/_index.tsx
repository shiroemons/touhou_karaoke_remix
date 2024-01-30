import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import type { InstantSearchServerState } from 'react-instantsearch';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import {
  getServerState,
  InstantSearchSSRProvider,
  InstantSearch,
} from 'react-instantsearch';
import { history } from 'instantsearch.js/cjs/lib/routers/index.js';
import algoliasearch from 'algoliasearch/lite.js';
import { createFetchRequester } from '@algolia/requester-fetch';
import SearchUI from '~/components/SearchUI/SearchUI';

export const meta: MetaFunction = () => {
  return [
    { title: "東方カラオケ検索 | 迷い家の白猫" },
    { name: "description", content: "東方カラオケ検索は、DAMやJOYSOUNDで配信されている東方系楽曲を曲名・歌手名・サークル名・原曲名で検索することができます。" },
  ];
};

// Algoliaの検索クライアントを作成
const searchClient = algoliasearch("DPK8SIFE76", "ce2f66a6be69d4d6e839d33df7c43f72", {
  requester: createFetchRequester(),
});

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl = request.url;
  const serverState = await getServerState(<Search serverUrl={serverUrl} />, {
    renderToString,
  });

  return json({
    serverState,
    serverUrl,
  });
};

type SearchProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
};

function Search({ serverState, serverUrl }: SearchProps) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        searchClient={searchClient}
        indexName="touhou_karaoke"
        routing={{
          router: history({
            getLocation() {
              if (typeof window === 'undefined') {
                return new URL(serverUrl!) as unknown as Location;
              }

              return window.location;
            },
            cleanUrlOnDispose: false,
          }),
        }}
        future={{
          preserveSharedStateOnUnmount: true
        }}
      >
        <SearchUI />
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
}

export default function Index() {
  const { serverState, serverUrl } = useLoaderData() as SearchProps;

  return (
    <Search serverState={serverState} serverUrl={serverUrl} />
  );
}