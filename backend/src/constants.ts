export const DB_NAME:string="formpilot"

export enum statuscodes {
    NOTFOUND=404,
    SUCCESFULL=200,
    INTERNALERROR=500,
    BADREQUEST=400,
    CREATED=201,
}

export enum templates{
    exhausted="exhausted",
    sorry="sorry"
}
export enum AssignmentStatus{
    success="success",
    failed="failed"
}

export const shiftregex=/^([01]\d|2[0-3]):([0-5]\d)$/


export interface Timestamps {
    createdAt?: Date;
    updatedAt?: Date;
}