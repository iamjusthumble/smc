import { gql, useQuery } from "@apollo/client";
import { FC } from "react";
import SearchSelectInput from "../components/core/search-select-input";
import MultiCheckInput from "../components/core/multi-check-input";
import MultiSearchSelectInput from "../components/core/multi-search-select";

interface BusPickerContainerProps {
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
  handleBlur: any;
}

const GET_ALL_BUS_NUMBERS = gql`
  query GetAllBusNumbers {
    getAllBusNumbers {
      _id
      vehicleNumber
    }
  }
`;

const BusesPicker: FC<BusPickerContainerProps> = ({
  filter,
  id,
  label,
  rawId,
  ...form
}) => {
  const { loading, data } = useQuery(GET_ALL_BUS_NUMBERS, {
    notifyOnNetworkStatusChange: false,
  });

  return (
    <MultiSearchSelectInput
      id={id ?? "buses"}
      label={label ?? "Buses"}
      options={(data?.getAllBusNumbers ?? [])?.map((bus: any) => ({
        label: {
          title: bus?.vehicleNumber as string,
        },
        value: rawId ? bus?._id : { id: bus?._id, name: bus?.vehicleNumber },
      }))}
      {...form}
    />
  );
};

const BusPicker: FC<BusPickerContainerProps> = ({
  filter,
  id,
  label,
  rawId,
  ...form
}) => {
  const { loading, data } = useQuery(GET_ALL_BUS_NUMBERS, {
    notifyOnNetworkStatusChange: false,
  });

  return (
    <SearchSelectInput
      id={id ?? "bus"}
      label={label ?? "Bus"}
      placeholder="Select a bus"
      optionsLoading={loading}
      options={(data?.getAllBusNumbers ?? [])?.map((bus: any) => ({
        label: {
          title: bus?.vehicleNumber as string,
        },
        value: rawId ? bus?._id : { id: bus?._id, name: bus?.vehicleNumber },
      }))}
      {...form}
    />
  );
};
export { BusPicker, BusesPicker };
