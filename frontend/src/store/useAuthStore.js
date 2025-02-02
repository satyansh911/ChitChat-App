import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create ((set) => ({
    authUser : null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth : true,

    checkAuth: async() => {
        try{
            const res = await axiosInstance.get("/auth/check");

            set({authUser: res.data});
        }catch(error){
            console.log("Error in checkAuth :", error.message);
            set({authUser: null});
        }
        finally{
            set({isCheckingAuth: false});
        }
    },

    signup: async(data) => {
        set({isSigningUp: true});
        try{
            const res= await axiosInstance.post("/auth/signup", data);
            console.log("API Response:", res);
            set({authUser: res.data});
            toast.success("Account created successfully");
            return true;
        }catch(error){
            const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
            toast.error(errorMessage);
            return false;
        } finally{
            set({isSigningUp: false});
        }
    },

    logout: async(data) =>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser : null});
            toast.success("Logged Out Successfully");
        }catch(error){
            toast.error(error.response.data.message);
        }
    }
}));