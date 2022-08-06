import axios from "axios";
import { BASE_URL } from "./baseUrl";
import { Joke } from "./types";

export const fetchJokes = () => {
	return axios.get<Joke[]>(`${BASE_URL}/jokes/`).then((res) => res.data);
};
