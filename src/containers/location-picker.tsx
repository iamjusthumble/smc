import { gql, useQuery } from "@apollo/client";
import { FC } from "react";
import SearchSelectInput from "../components/core/search-select-input";

interface LocationPickerContainerProps {
  filter?: {
    category?: string;
  };
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  labelHidden?: boolean;
  values: any;
  errors?: any;
  touched?: any;
  setFieldValue: any;
  rawId?: boolean;
}

const GET_LOCATIONS = gql`
  query Locations {
    getAllLocations {
      locations {
        _id
        name
      }
    }
  }
`;

const LocationPicker: FC<LocationPickerContainerProps> = ({
  filter,
  id,
  label,
  rawId,
  ...form
}) => {
  const { loading, data } = useQuery(GET_LOCATIONS, {
    notifyOnNetworkStatusChange: false,
  });

  return (
    <SearchSelectInput
      id={id ?? "category"}
      label={label ?? "Category"}
      placeholder="Select a category"
      optionsLoading={loading}
      options={(data?.getAllLocations?.locations ?? [])?.map(
        (location: any) => ({
          label: {
            title: location?.name as string,
          },
          value: rawId
            ? location?._id
            : { id: location?._id, name: location?.name },
        })
      )}
      {...form}
    />
  );
};

export default LocationPicker;
