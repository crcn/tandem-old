"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var chai_1 = require("chai");
describe(__filename + "#", function () {
    it("can find a value", function () {
        var ds = index_1.createDataStore([{ name: "a" }, { name: "b" }]);
        var item = index_1.dsFind(ds, { name: "a" });
        chai_1.expect(item.name).to.eql("a");
    });
    it("can find a value based on an index", function () {
        var ds = index_1.createDataStore([{ name: "a" }, { name: "b" }]);
        ds = index_1.dsIndex(ds, "name");
        var items = index_1.dsFilter(ds, { name: "a" });
        chai_1.expect(items.length).to.eql(1);
        chai_1.expect(items[0].name).to.eql("a");
    });
    it("can query for multiple properties", function () {
        var ds = index_1.createDataStore([{ a: "b", c: "d" }, { a: "b2", c: "e" }]);
        ds = index_1.dsIndex(ds, "a");
        var items = index_1.dsFilter(ds, { a: "b", c: "d" });
        chai_1.expect(items).to.eql([{ a: "b", c: "d" }]);
    });
    it("can query for multiple properties that are indexed", function () {
        var ds = index_1.createDataStore([{ a: "b", c: "d" }, { a: "b2", c: "e" }]);
        ds = index_1.dsIndex(ds, "a");
        ds = index_1.dsIndex(ds, "c");
        var items = index_1.dsFilter(ds, { a: "b", c: "d" });
        chai_1.expect(items).to.eql([{ a: "b", c: "d" }]);
    });
    it("index a shared property", function () {
        var ds = index_1.createDataStore([{ a: "b", c: "e" }, { a: "b", c: "e" }, { a: "b3", c: "f" }]);
        ds = index_1.dsIndex(ds, "a", false);
        var items = index_1.dsFilter(ds, { a: "b", c: "e" });
        chai_1.expect(items).to.eql([{ a: "b", c: "e" }, { a: "b", c: "e" }]);
    });
    it("doesn't return a value if the rest of the query is not found", function () {
        var ds = index_1.createDataStore([{ a: "b", c: "e" }, { a: "b", c: "e" }, { a: "b3", c: "f" }]);
        ds = index_1.dsIndex(ds, "a", false);
        var items = index_1.dsFilter(ds, { a: "b", c: "d" });
        chai_1.expect(items).to.eql([]);
    });
    it("can remove a record", function () {
        var ds = index_1.createDataStore([{ a: "b", c: "d" }, { a: "b2", c: "e" }]);
        ds = index_1.dsIndex(ds, "a");
        ds = index_1.dsIndex(ds, "c");
        ds = index_1.dsRemove(ds, { a: "b" });
        chai_1.expect(ds.records.length).to.eql(1);
    });
    it("can remove multiple records", function () {
        var ds = index_1.createDataStore([{ a: "b", c: "e" }, { a: "b2", c: "e" }, { a: "b3", c: "f" }]);
        ds = index_1.dsIndex(ds, "a");
        ds = index_1.dsRemove(ds, { c: "e" });
        chai_1.expect(ds.records.length).to.eql(1);
    });
    it("can update a record", function () {
        var ds = index_1.createDataStore([{ a: "b", c: "e" }, { a: "b2", c: "e" }, { a: "b3", c: "f" }]);
        ds = index_1.dsIndex(ds, "a");
        ds = index_1.dsUpdate(ds, { c: "e" }, { c: "d" });
        chai_1.expect(ds.records.length).to.eql(3);
        chai_1.expect(ds.records[0].c).to.eql("d");
        chai_1.expect(ds.records[1].c).to.eql("d");
    });
    it("can update one record", function () {
        var ds = index_1.createDataStore([{ a: "b", c: "e" }, { a: "b2", c: "e" }, { a: "b3", c: "f" }]);
        ds = index_1.dsIndex(ds, "a");
        ds = index_1.dsUpdateOne(ds, { c: "e" }, { c: "d" });
        chai_1.expect(ds.records.length).to.eql(3);
        chai_1.expect(ds.records[0].c).to.eql("d");
        chai_1.expect(ds.records[1].c).to.eql("e");
    });
});
//# sourceMappingURL=index-test.js.map