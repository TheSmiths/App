exports.definition = {
    config: {
        columns: {
            "survey_id": "TEXT PRIMARY KEY",
            "observer_id" : "TEXT",
            "created": "TEXT"
        },
        adapter: {
            type: "sql",
            collection_name: "surveys",
            idAttribute: "survey_id",
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            // extended functions and properties go here
        });

        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            // extended functions and properties go here
        });

        return Collection;
    }
};
