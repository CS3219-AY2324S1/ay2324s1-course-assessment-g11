import { getAuth, updateProfile } from "firebase/auth";

export const useUpdateProfile = () => {
    
    const updateUserProfile = async ({displayName, photoURL}: {displayName?: string, photoURL?: string}) => {
        const auth = getAuth();
        try {
            await updateProfile(auth.currentUser!, { displayName, photoURL });
        } catch (error) {
            console.log(error);
        }
    };
    
    return { updateUserProfile };
};