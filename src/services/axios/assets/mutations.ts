import AxiosInstance from "..";

const Axios = AxiosInstance();
export const UPLOAD_FILE = async (data: any) => {
  try {
    const response = await Axios.post("/assets/files", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (e) {
    return e;
  }
};
