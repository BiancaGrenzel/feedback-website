import { onAuthStateChanged, getAuth } from "firebase/auth";

const authService = {
    async checkUserLoggedIn(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            onAuthStateChanged(getAuth(), (user) => {
                if (user) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    },
    async getUserUid() {
        const auth = getAuth();
        return auth.currentUser?.uid ?? "";
    },
};

export default authService;
