// src/api/incomeApi.js
import API from "./axiosConfig";

export const fetchIncome = async () => {
  const res = await API.get("/income"); // backend endpoint
  return res.data;
};

export const saveIncome = async (incomeData) => {
  const res = await API.post("/income", incomeData);
  return res.data;
};
