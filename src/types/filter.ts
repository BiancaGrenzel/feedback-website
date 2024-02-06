import { WhereFilterOp } from "firebase/firestore";

export interface Filter {
    field: string;
    operator: WhereFilterOp;
    value: string;
}