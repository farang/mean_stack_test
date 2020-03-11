class CRUD_BASE {
    constructor(data) {
        this.model;
        this.data = {};

        Object.assign(this.data, data || {});
    }

    create() {
        return this._responseHandler((handler) => {
            this.model.create(this.data, handler);
        });
    }

    update(id) {
        return this._responseHandler((handler) => {
            this.model.findByIdAndUpdate(id, this.data, handler);
        });
    }

    delete(id) {
        return this._responseHandler((handler) => {
            this.model.findByIdAndDelete(id, handler);
        });
    }

    get(options, fields) {
        options = options || {};

        const skip = +(options.skip || 0);
        const limit = +(options.limit ? (options.limit > 100 ? 100 : options.limit) : 10);
        const searchQuery = options.searchQuery;

        let searchRequest = this._searchRequest(searchQuery, fields, options.filters);

        return this._responseHandler((handler) => {
            this.model.find(searchRequest, fields, handler)
                .skip(skip)
                .limit(limit);
        });
    }

    countRecords(options, fields) {
        options = options || {};

        const searchQuery = options.searchQuery || [];

        let searchRequest = this._searchRequest(searchQuery, fields, options.filters);

        return this._responseHandler((handler) => {
            this.model.countDocuments(searchRequest, handler);
        });
    }

    _searchRequest(searchQuery, fields, filters) {
        let searchRequest = {
            '$and': []
        };

        if (searchQuery) {
            if (typeof searchQuery !== 'object' || searchQuery.length === undefined) {
                searchQuery = [searchQuery];
            }

            const fieldsToLookAt = [];

            searchQuery.forEach(queryStr => {
                const mongooseQuery = { $regex: (`${queryStr}`), $options: "i" };
                const fieldsList = fields.split(' ').filter(f => f !== '_id');

                fieldsList.forEach(fieldName => {
                    fieldsToLookAt.push({ [fieldName]: mongooseQuery });
                });
            });

            if (fieldsToLookAt.length) {
                searchRequest['$and'].push({
                    $or: fieldsToLookAt
                });;
            }
        }

        if (filters) {
            searchRequest['$and'].push(...filters);
        }

        if (!searchRequest['$and'].length) {
            delete searchRequest['$and'];
        }

        return searchRequest;
    }

    _responseHandler(callback) {
        return new Promise((resolve, reject) => {
            callback((err, result) => {
                if (err) {
                    reject(err.code);
                } else {
                    resolve(result);
                }
            })
        });
    }
}

module.exports = CRUD_BASE;