import 'firebase/firestore';
import { collection, getDocs, addDoc, updateDoc, getDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Feedback } from '../../types/feedback';
import { Filter } from '../../types/filter';

const feedbacksCollectionRef = collection(db, "feedbacks");

const feedbacksService = {
    async getFeedbacks(filter?: Filter) {
        if (!filter) {
            const feedbacksData = await getDocs(feedbacksCollectionRef);
            return feedbacksData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        }
        const q = query(feedbacksCollectionRef, where(filter.field, filter.operator, filter.value));
        const feedbacksData = await getDocs(q);
        return feedbacksData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    },
    async getFeedbackById(id: string) {
        const feedbackDoc = await getDoc(doc(db, "feedbacks", id));
        return { ...feedbackDoc.data(), id: feedbackDoc.id };
    },
    async createFeedback(feedback: Feedback) {
        await addDoc(feedbacksCollectionRef, feedback);
    },
    async updateFeedback(id: string, name: string) {
        const feedbackDoc = doc(db, "feedbacks", id)
        const newFields = { name };
        await updateDoc(feedbackDoc, newFields)
    }, 
    async deleteFeedback(id: string) {
        const feedbackDoc = doc(db, "feedbacks", id);
        await deleteDoc(feedbackDoc);
    }
};

export default feedbacksService;