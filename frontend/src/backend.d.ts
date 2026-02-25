import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Investigation {
    status: string;
    title: string;
    date: Time;
    description: string;
    location: string;
}
export interface TeamMember {
    bio: string;
    name: string;
    role: string;
}
export interface Testimonial {
    date: Time;
    quote: string;
    author: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createInvestigation(id: string, investigation: Investigation): Promise<void>;
    createTeamMember(id: string, member: TeamMember): Promise<void>;
    createTestimonial(id: string, testimonial: Testimonial): Promise<void>;
    deleteInvestigation(id: string): Promise<void>;
    deleteTeamMember(id: string): Promise<void>;
    deleteTestimonial(id: string): Promise<void>;
    getAggregatedAnalytics(): Promise<{
        submissions: Array<[string, bigint]>;
        pageVisits: Array<[string, bigint]>;
    }>;
    getAllInvestigations(): Promise<Array<Investigation>>;
    getAllTeamMembers(): Promise<Array<TeamMember>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getCallerUserRole(): Promise<UserRole>;
    getInvestigation(_caller: string): Promise<Investigation | null>;
    getTeamMember(id: string): Promise<TeamMember | null>;
    getTestimonial(id: string): Promise<Testimonial | null>;
    isCallerAdmin(): Promise<boolean>;
    recordFormSubmission(formType: string): Promise<void>;
    recordPageVisit(pageName: string): Promise<void>;
    updateInvestigation(id: string, investigation: Investigation): Promise<void>;
    updateTeamMember(id: string, member: TeamMember): Promise<void>;
    updateTestimonial(id: string, testimonial: Testimonial): Promise<void>;
    verifyAdmin(): Promise<boolean>;
}
