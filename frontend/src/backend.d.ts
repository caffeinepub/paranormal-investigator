import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface Testimonial {
    date: Time;
    quote: string;
    author: string;
}
export interface AdminCaseResult {
    message: string;
    success: boolean;
}
export type Time = bigint;
export interface Investigation {
    status: string;
    title: string;
    date: Time;
    description: string;
    location: string;
}
export interface CaseLookupResult {
    hasCase: boolean;
    caseSummaries: Array<CaseSummary>;
}
export interface CaseStatusChange {
    changedBy: string;
    toStatus: string;
    fromStatus: string;
    timestamp: Time;
    caseId: string;
}
export interface TeamMember {
    bio: string;
    name: string;
    role: string;
}
export interface CaseSummary {
    status: string;
    caseId: string;
    location: string;
    phenomenaType: string;
}
export interface AdminCredentials {
    pin: string;
    email: string;
}
export interface Case {
    id: string;
    ownerEmail: string;
    resolved: boolean;
    contactInfo: string;
    description: string;
    timestamp: Time;
    photo?: ExternalBlob;
    location: string;
    phenomenaType: string;
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
    deleteCase(caseId: string): Promise<boolean>;
    deleteInvestigation(id: string): Promise<void>;
    deleteTeamMember(id: string): Promise<void>;
    deleteTestimonial(id: string): Promise<void>;
    getAdminCredentials(): Promise<AdminCredentials>;
    getAdminPrincipal(): Promise<Principal | null>;
    getAllCases(): Promise<Array<Case>>;
    getAllInvestigationCases(): Promise<Array<Investigation>>;
    getAllTeamMembers(): Promise<Array<TeamMember>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCaseById(caseId: string): Promise<Case | null>;
    getCaseStatusChanges(caseId: string): Promise<Array<CaseStatusChange>>;
    getCasesForUser(email: string): Promise<CaseLookupResult>;
    getInvestigation(id: string): Promise<Investigation | null>;
    getTeamMember(id: string): Promise<TeamMember | null>;
    getTestimonial(id: string): Promise<Testimonial | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    markCaseResolved(caseId: string, adminEmail: string): Promise<AdminCaseResult>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitCase(location: string, phenomenaType: string, description: string, contactInfo: string, photo: ExternalBlob | null, ownerEmail: string): Promise<string>;
    updateInvestigation(id: string, investigation: Investigation): Promise<void>;
    updateTeamMember(id: string, member: TeamMember): Promise<void>;
    updateTestimonial(id: string, testimonial: Testimonial): Promise<void>;
    verifyAdmin(): Promise<boolean>;
    verifyAdminCredentials(email: string, pin: string): Promise<boolean>;
}
