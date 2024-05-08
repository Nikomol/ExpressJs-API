class User {
    constructor(name, dateOfBirth, phone, document, workData, authKey) {
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.phone = phone;
        this.document = document;
        this.workData = workData;
        this.authKey = authKey;
    }
}

module.exports = User;
