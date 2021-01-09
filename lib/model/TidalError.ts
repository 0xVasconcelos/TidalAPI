export class TidalError extends Error implements ITidalError {
    constructor(err: ITidalError) {
        super("TIDAL's API threw an error: " + err.userMessage + " | Details: " + JSON.stringify(err));
        this.userMessage = err.userMessage;
        this.subStatus = err.subStatus;
        this.status = err.status;
    }

    status: number;
    subStatus: number;
    userMessage: string;
}


export interface ITidalError {
    status: number;
    subStatus: number;
    userMessage: string;
}
