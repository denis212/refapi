'use strict';

module.exports = function(app) {
    var todoList = require('./controller');

    app.route('/')
        .get(todoList.index);

    app.route('/referral')
        .get(todoList.listref)
        .post(todoList.addref);
        // .put(todoList.updref)
        // .delete(todoList.delref)

    app.route('/referral/:no_tlp')
        .get(todoList.achieved);
};
