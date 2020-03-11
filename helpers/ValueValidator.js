class ValueValidator {
    constructor() {
        this.errors = [];
    }

    isEmail(email, fieldName = 'Email') {
        this._pushError(
            !this._valuesExists(email) || /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email),
            `${fieldName} is not valid.`
        );
    }

    isName(name, fieldName = 'Name') {
        this._pushError(
            !this._valuesExists(name) || /^[0-9a-zA-Z_.-]+$/.test(name),
            `${fieldName} contains special caracters.`
        );
    }

    required(value, fieldName = 'Value') {
        this._pushError(this._valuesExists(value), `${fieldName} is required`);
    }

    _valuesExists(value) {
        return !!value || value === 0;
    }

    _pushError(valid, message) {
        if (!valid) {
            this.errors.push(message);
        }
    }
}

module.exports = ValueValidator;
