import axios from "axios";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    withCredentials : true,
    timeout : 120000,
});

export const isBrowser = typeof window !== "undefined";

export class LocalStorage {

    static get(key : string){
        if(!isBrowser) return;
        const value = localStorage.getItem(key);
        if(value) {
            try {
                return JSON.parse(value);
            } catch (error) {
                return error;
            }
        }
        else return null;
    }

    static set(key : string, value : Object){
        if(!isBrowser) return;
        localStorage.setItem(key, JSON.stringify(value));
    }

    static remove(key : string){
        if(!isBrowser) return;
        localStorage.removeItem(key);
    }

    static clear() {
        if (!isBrowser) return;
        localStorage.clear();
    }
}