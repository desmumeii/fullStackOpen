import axios from "axios";
import type { DiaryEntry, NewDiaryEntry } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

export const getAllDiaries = async (): Promise<DiaryEntry[]> => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
};

export const createDiaryEntry = (object: NewDiaryEntry) => {
  return axios
    .post<DiaryEntry>(baseUrl, object)
    .then((response) => response.data);
}