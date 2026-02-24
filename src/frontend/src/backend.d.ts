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
export type Time = bigint;
export interface ParanormalCase {
    status: InvestigationStatus;
    contactInfo: string;
    description: string;
    timestamp: Time;
    caseId: string;
    photo?: ExternalBlob;
    location: string;
    phenomenaType: PhenomenaType;
}
export enum InvestigationStatus {
    resolved = "resolved",
    submitted = "submitted",
    underInvestigation = "underInvestigation",
    inconclusive = "inconclusive"
}
export enum PhenomenaType {
    electromagneticAnomalies = "electromagneticAnomalies",
    unexplainedSounds = "unexplainedSounds",
    movingObjects = "movingObjects",
    apparitions = "apparitions"
}
export interface backendInterface {
    filterCasesByLocation(location: string): Promise<Array<ParanormalCase>>;
    filterCasesByType(phenomenaType: PhenomenaType): Promise<Array<ParanormalCase>>;
    getAllCases(): Promise<Array<ParanormalCase>>;
    getCaseById(caseId: string): Promise<ParanormalCase | null>;
    submitCase(location: string, phenomenaType: PhenomenaType, description: string, contactInfo: string, photo: ExternalBlob | null): Promise<string>;
    updateCaseStatus(caseId: string, newStatus: InvestigationStatus): Promise<boolean>;
}
