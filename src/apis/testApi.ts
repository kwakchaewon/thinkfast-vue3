import {tbAxios} from "@/apis/axios.ts";

export const testApi = {
    testApi: async () => {
        const response = await tbAxios.get('/test')
        return response.data
    }
}