export class ResponseSingle<T> {
    data: T;
    description?: string;

    constructor(data: T, description?: string) {
        this.data = data;
        this.description = description;
    }
}
