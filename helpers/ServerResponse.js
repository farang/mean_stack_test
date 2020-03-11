class ServerResponse {
    constructor(code, result) {
        this.result;
        this.status;

        switch (code) {
            case 200: {
                this.result = result;
                this.status = 200;
                break;
            }
            case 500: {
                this.message = result;
                this.status = 500;
                break;
            }
        }
    }

    toJson() {
        return {
            status: this.status,
            result: this.result
        }
    }
}

module.exports = ServerResponse;