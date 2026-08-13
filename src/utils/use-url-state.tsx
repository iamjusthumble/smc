import { MakeGenerics, useNavigate, useSearch } from "react-location";

export default function useUrlState<T = any>(
  field: string
): [T, (val: T) => void] {
  const navigate = useNavigate();
  const search = useSearch<MakeGenerics<{ Search: any }>>();

  const setState = (newState: Partial<T>) => {
    console.log("updating state: ", field, " with value: ", newState);
    navigate({
      search: (old) => ({
        ...old,
        [field]: newState,
      }),
    });
  };

  return [search[field], setState];
}
