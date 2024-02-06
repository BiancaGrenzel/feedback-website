import 'firebase/firestore';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { User } from '../../types/user';
import { Filter } from '../../types/filter';

const usersCollectionRef = collection(db, "users");

const usersService = {
    async getUsers(filter?: Filter) {
        if (!filter) {
            const usersData = await getDocs(usersCollectionRef);
            return usersData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        }
        const q = query(usersCollectionRef, where(filter.field, filter.operator, filter.value));
        const usersData = await getDocs(q);
        return usersData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    },
    async getUserById(id: string) {
        const q = query(usersCollectionRef, where('id_auth', '==', id));
        const usersData = await getDocs(q);
        return usersData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))[0];
    },
    async createUser(user: User) {
        await addDoc(usersCollectionRef, user);
    },
    async updateUser(id: string, name: string) {
        const userDoc = doc(db, "users", id)
        const newFields = { name };
        await updateDoc(userDoc, newFields)
    }, 
    async deleteUser(id: string) {
        const userDoc = doc(db, "users", id);
        await deleteDoc(userDoc);
    }
};

export default usersService;
