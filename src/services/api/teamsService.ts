import 'firebase/firestore';
import { collection, getDocs, addDoc, updateDoc, getDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Team } from '../../types/team';
import { Filter } from '../../types/filter';

const teamsCollectionRef = collection(db, "teams");

const teamsService = {
    async getTeams(filter?: Filter) {
        if(!filter) {
        const teamsData = await getDocs(teamsCollectionRef);
        return teamsData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        }
        const q = query(teamsCollectionRef, where(filter.field, filter.operator, filter.value));
        const teamsData = await getDocs(q);
        return teamsData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    },
    async getTeamById(id: string) {
        const teamDoc = await getDoc(doc(db, "teams", id));
        return { ...teamDoc.data(), id: teamDoc.id };
    },
    async createTeam(team: Team) {
        await addDoc(teamsCollectionRef, team);
    },
    async updateTeam(id: string, name: string) {
        const teamDoc = doc(db, "teams", id)
        const newFields = { name };
        await updateDoc(teamDoc, newFields)
    }, 
    async deleteTeam(id: string) {
        const teamDoc = doc(db, "teams", id);
        await deleteDoc(teamDoc);
    }
};

export default teamsService;