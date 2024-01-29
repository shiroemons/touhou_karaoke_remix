// /joysound/musicpost

import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import type { InstantSearchServerState } from 'react-instantsearch';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import {
  getServerState,
  InstantSearchSSRProvider,
  InstantSearch,
  SearchBox,
  Configure,
  Hits,
  Pagination,
  HierarchicalMenu,
  RefinementList,
  Stats,
} from 'react-instantsearch';
import { history } from 'instantsearch.js/cjs/lib/routers/index.js';
import searchClient from '~/lib/searchClient';

export const meta: MetaFunction = () => {
  return [
    { title: "東方カラオケ検索 JOYSOUND(うたスキ) | 迷い家の白猫" },
    { name: "description", content: "JOYSOUND(うたスキ)で配信されている東方系楽曲を曲名・歌手名・サークル名・原曲名で検索することができます。" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl = request.url;
  const serverState = await getServerState(
    <Search serverUrl={serverUrl} />,
    { renderToString }
  );

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
        <Configure filters="karaoke_type:'JOYSOUND(うたスキ)'" />
        <SearchBox
          placeholder="キーワード入力(曲名、原曲など)"
        />
        <Stats
          translations={{
            rootElementText({ nbHits, processingTimeMS }) {
              if (nbHits === 0) {
                return `0 件 (${processingTimeMS.toLocaleString()}ms)`;
              } else if (nbHits === 1) {
                return `1 件 (${processingTimeMS.toLocaleString()}ms)`;
              } else {
                return `${nbHits.toLocaleString()} 件 (${processingTimeMS.toLocaleString()}ms)`;
              }
            }
          }}
        />
        <HierarchicalMenu attributes={[
            "original_songs.categories.lvl0",
            "original_songs.categories.lvl1",
            "original_songs.categories.lvl2",
          ]}
          limit={100}
          sortBy={['name:asc']}
          title="原作/原曲"
        />
        <RefinementList
          attribute="karaoke_type"
          title="カラオケメーカー"
        />
        <RefinementList
          attribute="karaoke_delivery_models.name"
          limit={20}
          title="配信機種"
        />
        <RefinementList
          attribute="videos.type"
          title="動画"
        />
        <RefinementList
          attribute="touhou_music.type"
          title="東方同人音楽流通"
        />
        <RefinementList
          attribute="circle.name"
          limit={150}
          sortBy={['name:asc']}
          title="サークル"
        />
        <Hits />
        <Pagination className="flex self-center" />
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
}

export default function JoysoundMusicpostPage() {
  const { serverState, serverUrl } = useLoaderData() as SearchProps;

  return (
    <main>
      <Search serverState={serverState} serverUrl={serverUrl} />
    </main>
  );
}