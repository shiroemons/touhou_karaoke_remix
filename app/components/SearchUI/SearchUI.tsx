import {
  Configure,
  SearchBox,
  Hits,
  Pagination,
  HierarchicalMenu,
  RefinementList,
  Stats,
} from 'react-instantsearch';
import { Panel } from '~/components/Panel';

type SearchUIProps = {
  configureFilters?: string;
};

export default function SearchUI({ configureFilters }: SearchUIProps) {
  return (
    <>
      {configureFilters && <Configure filters={configureFilters} />}
      <div className="grid grid-cols-12 gap-4">
        <aside className="self-start sticky top-0 col-span-3">
          <div className='pt-20'>
            <Panel header="原作/原曲">
              <HierarchicalMenu attributes={[
                  "original_songs.categories.lvl0",
                  "original_songs.categories.lvl1",
                  "original_songs.categories.lvl2",
                ]}
                limit={100}
                sortBy={['name:asc']}
                title="原作/原曲"
                classNames={{
                  label: "pr-2",
                }}
              />
            </Panel>
          </div>
          <div className='pt-4'>
            <Panel header="サークル">
              <RefinementList
                attribute="circle.name"
                limit={150}
                sortBy={['name:asc']}
                title="サークル"
                classNames={{
                  label: "pl-2",
                  labelText: "px-2",
                }}
              />
            </Panel>
          </div>
        </aside>

        <main className="col-span-6">
          <SearchBox
            placeholder="キーワード入力(曲名、原曲など)"
            classNames={{
              root: "pt-8",
            }}
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
          <Hits />
          <Pagination className="flex justify-center py-8" />
        </main>

        <aside className="self-start sticky top-0 col-span-3">
          {!configureFilters && <div className='pt-20'>
            <Panel header="カラオケメーカー">
              <RefinementList
                attribute="karaoke_type"
                title="カラオケメーカー"
                classNames={{
                  label: "pl-2",
                  labelText: "px-2",
                }}
              />
            </Panel>
          </div>}
          <div className={configureFilters ? 'pt-20' : 'pt-4' }>
            <Panel header="配信機種">
              <RefinementList
                attribute="karaoke_delivery_models.name"
                limit={20}
                title="配信機種"
                classNames={{
                  label: "pl-2",
                  labelText: "px-2",
                }}
              />
            </Panel>
          </div>
          <div className='pt-4'>
            <Panel header="動画">
              <RefinementList
                attribute="videos.type"
                title="動画"
                classNames={{
                  label: "pl-2",
                  labelText: "px-2",
                }}
              />
            </Panel>
          </div>
          <div className='pt-4'>
            <Panel header="東方同人音楽流通">
              <RefinementList
                attribute="touhou_music.type"
                title="東方同人音楽流通"
                classNames={{
                  label: "pl-2",
                  labelText: "px-2",
                }}
              />
            </Panel>
          </div>
        </aside>
      </div>
    </>
  )
}