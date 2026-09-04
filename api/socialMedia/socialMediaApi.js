import api from "../baseUrl";

const socialMediaApi = {};


socialMediaApi.getInstagramPosts = async () => api.get("/social-media/instagram-posts"); 

export default socialMediaApi;