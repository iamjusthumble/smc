import { useSearch } from "react-location";
import { LocationGenerics } from "../router/location";

interface UseTableData {
  rows: any[];
  count: number;
}

const useTableData = ({ rows, count }: UseTableData): any => {
  const searchParams = useSearch<LocationGenerics>();
  return {
    rows: rows || [],
    total: count || 0,
    totalPages: Math.ceil(count / (searchParams?.pageSize ?? 10)),
    page: searchParams.page || 1,
    pageSize: searchParams.pageSize || 10,
  };
};

export default useTableData;
