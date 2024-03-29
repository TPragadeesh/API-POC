import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface RuleSetResponse{
    ruleName: string;
    message: string;
    severity: string;
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
}

const useGovernance = (payload: string) =>{
    const fetchGovernanceResponse = () =>
        axios
            .post<RuleSetResponse[]>("http://localhost:3000/evaluateRule", JSON.parse(payload))
            .then((res) => res.data);

    return useQuery<RuleSetResponse[], Error>({
        queryKey: ["ruleSetResponse"],
        queryFn: fetchGovernanceResponse,
    });
};

export default useGovernance;