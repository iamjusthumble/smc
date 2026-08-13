export interface ITripData {
  date: {
    dayInWords: string;
    dayInNumber: string;
  };
  origin: any;
  destination: any;
  numberOfBusAssigned: string;
  timeScheduled: {
    startTime: string;
    endTime: string;
  };
  tripType: string;
}
