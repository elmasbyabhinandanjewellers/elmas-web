import api from "../baseUrl";

const bannersApi = {}

bannersApi.fetchBanners = async () => api.get('/banners');

export default bannersApi;