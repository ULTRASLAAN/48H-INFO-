export const API_URL = "/api";

export const authState = {
    currentUser: null
};

export function setCurrentUser(user) {
    authState.currentUser = user;
}