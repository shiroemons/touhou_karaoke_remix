import {
  Configure,
  SearchBox,
  Hits,
  Pagination,
  HierarchicalMenu,
  RefinementList,
  Stats,
} from 'react-instantsearch';

type SearchUIProps = {
  configureFilters?: string;
};

export default function SearchUI({ configureFilters }: SearchUIProps) {
  return (
    <>
      {configureFilters && <Configure filters={configureFilters} />}
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
      {!configureFilters && <RefinementList
        attribute="karaoke_type"
        title="カラオケメーカー"
      />}
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
    </>
  )
}