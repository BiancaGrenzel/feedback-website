import "firebase/firestore";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  getDoc,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Department } from "../../types/departments";
import { Filter } from "../../types/filter";

const departmentsCollectionRef = collection(db, "areas");

const departmentsService = {
  async getDepartments(filter?: Filter) {
    if (!filter) {
      const departmentsData = await getDocs(departmentsCollectionRef);
      return departmentsData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    }
    const q = query(departmentsCollectionRef, where(filter.field, filter.operator, filter.value));
    const departmentsData = await getDocs(q);
    return departmentsData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  },
  async getDepartmentById(id: string) {
    const departmentDoc = await getDoc(doc(db, "areas", id));
    return { ...departmentDoc.data(), id: departmentDoc.id };
  },
  async createDepartment(department: Department) {
    await addDoc(departmentsCollectionRef, department);
  },
  async updateDepartment(id: string, name: string) {
    const departmentDoc = doc(db, "areas", id);
    const newFields = { name };
    await updateDoc(departmentDoc, newFields);
  },
  async deleteDepartment(id: string) {
    const departmentDoc = doc(db, "areas", id);
    await deleteDoc(departmentDoc);
  },
};

export default departmentsService;
