import axios from "axios";


export const fetchEurekaSummary = async () => {
    const { data } = await axios.get("/admin/summary");
    return data;
};

export const fetchEurekaServices = async () => {
    const { data } = await axios.get("/admin/services");
    return data;
};

export const fetchEurekaInstances = async (instanceId: string) => {
    const { data } = await axios.get(`/admin/instance/${instanceId}`);
    return data;
};