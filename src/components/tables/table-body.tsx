import _ from "lodash";
import { FC } from "react";
import { classNames } from "../../utils";

interface TableBodyComponentProps<TData = any> {
  data: {
    rows: TData[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  renderColumns?: FC;
  renderItem?: FC<TData>;
  renderLoader?: FC;
  loading?: boolean;
  fixed?: boolean;
}

const TableBodyComponent: FC<TableBodyComponentProps> = ({
  renderColumns,
  data,
  renderItem,
  loading,
  renderLoader,
  fixed,
}) => {
  return (
    <div className="flex flex-1 overflow-hidden rounded-t-xl border border-b-0 border-gray-200">
      <div className="no-scrollbar flex w-full flex-1 flex-col overflow-x-auto overflow-y-auto md:max-h-[27rem] xl:max-h-[29rem] 2xl:max-h-[32rem]">
        <table
          className={classNames(
            fixed ? "table-fixed" : "table-auto",
            "min-w-full divide-y divide-gray-100"
          )}
        >
          <thead className="sticky top-0 bg-gray-50">
            {renderColumns?.({}) ?? (
              <tr>
                {Object.keys(data.rows[0])
                  .filter((field) => !_.isObject(data.rows[0][field]))
                  .map((field) => (
                    <th
                      key={field}
                      scope="col"
                      className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      {_.startCase(field)}
                    </th>
                  ))}
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading
              ? renderLoader?.({}) ?? (
                  <tr>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="h-3 w-full animate-pulse rounded-md bg-gray-200" />
                    </td>
                  </tr>
                )
              : data.rows?.map(
                  (item, idx) =>
                    renderItem?.(item, idx) ?? (
                      <tr key={item._id} className="hover:bg-gray-50">
                        {Object.keys(data.rows[0])
                          .filter((field) => !_.isObject(data.rows[0][field]))
                          .map((field) => (
                            <td
                              key={field}
                              className="whitespace-nowrap px-6 py-4 text-sm text-gray-600"
                            >
                              {_.isBoolean(item[field])
                                ? item[field]
                                  ? "Yes"
                                  : "No"
                                : item[field]}
                            </td>
                          ))}
                      </tr>
                    )
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableBodyComponent;
