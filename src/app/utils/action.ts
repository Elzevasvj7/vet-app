import axios, { AxiosError } from "axios";
import { ServerActionResponse } from "../hooks/useActionProcessor";

const baseUrl = "https://rickandmortyapi.com/api";



interface Rick {
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

export const getAll = async () => {
  const { data } = await axios.get(baseUrl);
  return data;
};
export const getById = async (
  prevState: any,
  { id }: { id: string }
): Promise<
  ServerActionResponse<Rick>
> => {
  try {
    const { data } = await axios.get(`${baseUrl}/character/${id}`);
    return {
      success: true,
      data: data,
      error: null,
    }
  } catch (error: any) {
    if (error instanceof AxiosError){
      if(error.response){
        return {
          success: false,
          data: null,
          error: {
            message: error.message,
            statusCode: error.code,
            details: error.response.data,
          },
        }
      }
    }
    return {
      success: false,
      data: null,
      error: {
        message: error.message,
        statusCode: "500",
        details: {
          name: error.name,
          message: error.message,
        },
      },
    }
  }
};
export const getLocation = async (prev: any, { id }: { id: string }) => {
  try {
    const { data } = await axios.get(`${baseUrl}/location/${id}`);
    return {
      success: true,
      data: data,
      error: null,
    };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return {
          success: false,
          data: null,
          error: {
            message: error.message,
            statusCode: error.code,
            details: error.response.data,
          },
        };
      }
    }
    return {
      success: false,
      data: null,
      error: {
        message: error.message,
        statusCode: "500",
        details: {
          name: error.name,
          message: error.message,
        },
      },
    };
  }
};
