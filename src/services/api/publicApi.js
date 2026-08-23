import axios from "axios";
import { API_BASE_URL } from "./apiservices";

export const getCatagories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error.response?.data || error.message;
    }
}; 

export const getAllSkills = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/skills`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error.response?.data || error.message;
    }
};