import SERVER_BASE_URL from "./server_url";
import commonAPI from './commonAPI'


// register
export const registerAPI = async (reqBody) => {
    return await commonAPI("POST",`${SERVER_BASE_URL}/register`,reqBody)
}

// login
export const loginAPI = async (reqBody) => {
    return await commonAPI("POST",`${SERVER_BASE_URL}/login`,reqBody)
}

// add order
export const addOrderAPI = async (reqBody,reqHeader) => {
    return await commonAPI("POST", `${SERVER_BASE_URL}/orders`, reqBody,reqHeader);
};

export const getUserOrderAPI = async (userId, reqHeader) => {
    return await commonAPI("GET", `${SERVER_BASE_URL}/orders/${userId}`, null, reqHeader);
};

export const updateOrderAPI = async (orderId, reqBody, reqHeader) => {
    return await commonAPI("PUT", `${SERVER_BASE_URL}/orders/${orderId}`, reqBody, reqHeader);
};
