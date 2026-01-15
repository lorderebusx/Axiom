import { Company } from "@/data/companies";

export type GraphNode = {
    id: string;
    name: string;
    type: "company" | "person";
    val: number; // Size of the node
    color: string;
};

export type GraphLink = {
    source: string;
    target: string;
};

export const generateGraphData = (companies: Company[]) => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const peopleSet = new Set<string>();

    // 1. Create Nodes for every Company
    companies.forEach((company) => {
        nodes.push({
            id: company.id,
            name: company.name,
            type: "company",
            val: 20, // Companies are big nodes
            color: company.auditScore < 50 ? "#ff0033" : "#ffffff", // Red if Critical, White otherwise
        });

        // 2. Track every Board Member
        company.boardMembers.forEach((person) => {
            peopleSet.add(person);

            // 3. Create a Link (Person <--> Company)
            links.push({
                source: person, // The Person ID
                target: company.id, // The Company ID
            });
        });
    });

    // 4. Create Nodes for every Person
    peopleSet.forEach((person) => {
        nodes.push({
            id: person,
            name: person,
            type: "person",
            val: 5, // People are small nodes
            color: "#ccff00", // Axiom Acid Green
        });
    });

    return { nodes, links };
};