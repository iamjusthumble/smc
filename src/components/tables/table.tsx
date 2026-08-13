import { Dispatch, FC, SetStateAction } from "react";
import TableBodyComponent from "./table-body";
import TableEmptyComponent from "./table-empty";
import TableFooterComponent from "./table-footer";
import TableHeaderComponent from "./table-header";
import TableGridBodyComponent from "./table-grid-body";
import { useUrlState } from "../../utils";
import { skip } from "node:test";

interface TableComponentProps<TData = any> {
  title: string;
  data: {
    rows: TData[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  skip: number;
  limit: number;
  setSkip: Dispatch<SetStateAction<number>>;

  loading?: boolean;
  showTableHeader?: boolean;
  isRefetching?: boolean;
  renderColumns?: FC<TData>;
  renderItem?: FC<TData>;
  renderGridItem?: FC<TData>;
  renderFilter?: FC<{
    filterOpen: boolean;
    setFilterOpen: (val: boolean) => void;
  }>;
  renderExport?: FC<{
    exportOpen: boolean;
    setExportOpen: (val: boolean) => void;
  }>;
  renderLoader?: FC;
  searchOptions?: { label: string; value: string }[];
  renderGridLoader?: FC;
  renderHeaderItems?: FC;
  refetch: () => void;
  hasSearch?: boolean;
  onSearchSubmit?: (search: string, searchField: string) => void;
  defaultSearchField?: string;
  defaultView?: "grid" | "list";
}

const TableComponent: FC<TableComponentProps> = ({
  isRefetching,
  defaultView,
  title,
  data,
  loading,
  renderGridLoader,
  renderColumns,
  renderItem,
  limit,
  skip,
  setSkip,
  showTableHeader,
  renderFilter,
  renderGridItem,
  renderExport,
  refetch,
  renderLoader,
  renderHeaderItems,
  onSearchSubmit,
  hasSearch,
  searchOptions,
  defaultSearchField,
}) => {
  const [viewType] = useUrlState("view-type");
  const hasGridMode = !!renderGridItem;
  return (
    <div className=" w-full flex-1 flex flex-col overflow-y-hidden min-w-full">
      <div className="w-full mb-6">
        {showTableHeader && (
          <TableHeaderComponent
            title={title}
            renderFilter={renderFilter}
            searchOptions={searchOptions}
            renderExport={renderExport}
            gridable={hasGridMode}
            refetch={refetch}
            renderHeaderItems={renderHeaderItems}
            hasSearch={hasSearch}
            defaultSearchField={defaultSearchField}
            loading={isRefetching}
            defaultView={defaultView}
            onSearchSubmit={onSearchSubmit}
          />
        )}
      </div>
      {!loading && (data?.total || 0) === 0 ? (
        <TableEmptyComponent />
      ) : (
        <>
          {viewType === "grid" && hasGridMode ? (
            <TableGridBodyComponent
              data={data}
              loading={loading}
              renderLoader={renderGridLoader}
              renderItem={renderGridItem}
            />
          ) : (
            <TableBodyComponent
              data={data}
              loading={loading}
              renderColumns={renderColumns}
              renderLoader={renderLoader}
              renderItem={renderItem}
            />
          )}

          <div className="">
            <TableFooterComponent
              refetch={refetch}
              limit={limit}
              skip={skip}
              setSkip={setSkip}
              data={data}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TableComponent;
