export class ResponseOK {
    status: string;
    description: string;

    constructor(description: string = '') {
        this.status = 'OK';
        this.description = description;
    }
}
