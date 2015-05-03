exports.definition = {
    config: {
        columns: {
            "type": "TEXT",
            "survey_id": "TEXT",
            "data": "TEXT",
            "event_id": "INTEGER PRIMARY KEY AUTOINCREMENT",
        },
        adapter: {
            type: "sql",
            collection_name: "events",
            idAttribute: "event_id",
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
