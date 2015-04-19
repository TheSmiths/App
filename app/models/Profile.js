exports.definition = {
    config: {
        columns: {
            "name": "STRING",
            "height": "INT",
            "boat": "STRING",
            "surveys": "INT",
        },
        defaults: {
            "name": "",
            "height": 0,
            "boat": "",
            "surveys": 0,
        },
        adapter: {
            type: "properties",
            collection_name: "Profile"
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
