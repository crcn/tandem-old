import { expect } from "chai";
import { timeout } from "sf-core/test/utils";
import { ParallelBus } from "mesh";
import * as MemoryDSBus from "mesh-memory-ds-bus";
import { BrokerBus, PostDsNotifierBus } from "sf-core/busses";
import { ActiveRecord, ActiveRecordCollection, insert } from "./base";
import { FindAction, InsertAction, UpdateAction, RemoveAction } from "sf-core/actions";
import { Dependencies, MainBusDependency, ActiveRecordFactoryDependency } from "sf-core/dependencies";

describe(__filename + "#", () => {
  describe("ActiveRecord#", () => {
    let deps: Dependencies;
    let broker: BrokerBus;

    class Person extends ActiveRecord {
      public name: string;
      public zip: number;
      public emailAddress: string;
      public _id: string;
      serialize() {
        return {
          name: this.name,
          zip: this.zip,
          emailAddress: this.emailAddress
        };
      }
    }

    beforeEach(() => {
      deps = new Dependencies(
        new ActiveRecordFactoryDependency("person", Person),
        new MainBusDependency(broker = new BrokerBus(ParallelBus))
      );

      broker.register(new PostDsNotifierBus(MemoryDSBus.create(), broker));
    });
    it("can be created", () => {
      const ar: ActiveRecord = ActiveRecordFactoryDependency.find("person", deps).create("people");
      expect(ar).to.be.an.instanceof(ActiveRecord);
      expect(ar.collectionName).to.equal("people");
      expect(ar.bus).to.equal(broker);
    });
    it("can insert a new record", async () => {
      const ar: ActiveRecord = ActiveRecordFactoryDependency.find("person", deps).create("people", {
        name: "a"
      });
      await ar.insert();
      const chunk = await broker.execute(new FindAction(ar.collectionName, ar.serialize() )).read();
      expect(chunk.value.name).to.equal("a");
    });
    it("can load an active record", async () => {
      const ar: Person = <Person>ActiveRecordFactoryDependency.find("person", deps).create("people", {
        _id: "person1"
      });
      await broker.execute(new InsertAction("people", { _id: "person1", name: "a", zip: 90210 }));
      await ar.load();
      expect(ar.zip).to.equal(90210);
    });
    it("can update an active record", async () => {
      await broker.execute(new InsertAction("people", { _id: "person1", name: "a", zip: 90210 }));
      const ar: Person = <Person>ActiveRecordFactoryDependency.find("person", deps).create("people", {
        _id: "person1",
        zip: 11111
      });
      await ar.update();
      const chunk = await broker.execute(new FindAction(ar.collectionName, { _id: "person1" } )).read();
      expect(chunk.value.zip).to.equal(11111);
    });

    it("can remove an active record", async () => {
      await broker.execute(new InsertAction("people", { _id: "person1", name: "a", zip: 90210 }));
      const ar: Person = <Person>ActiveRecordFactoryDependency.find("person", deps).create("people", {
        _id: "person1"
      });
      await ar.remove();
      const chunk = await broker.execute(new FindAction(ar.collectionName, { _id: "person1" } )).read();
      expect(chunk.done).to.equal(true);
    });

    it("throws an error if load() and id does not exist", async () => {
      expect(() => {
        <Person>ActiveRecordFactoryDependency.find("person", deps).create("people").load();
      }).to.throw("Cannot query active record if it does not have an identifier.");
    });

    it("throws an error if remove() and id does not exist", async () => {
      expect(() => {
        <Person>ActiveRecordFactoryDependency.find("person", deps).create("people").load();
      }).to.throw("Cannot query active record if it does not have an identifier.");
    });

    it("throws an error if update() and id does not exist", async () => {
      expect(() => {
        <Person>ActiveRecordFactoryDependency.find("person", deps).create("people").load();
      }).to.throw("Cannot query active record if it does not have an identifier.");
    });

    it("inserts a new active record if an ID is not present and save() is called", async () => {
      const ar: Person = <Person>ActiveRecordFactoryDependency.find("person", deps).create("people", {
        name: "a"
      });
      await ar.save();
      expect(ar._id).not.to.equal(undefined);
      const { value } = await broker.execute(new FindAction(ar.collectionName, { _id: ar._id })).read();
      expect(value.name).to.equal("a");
      expect(value._id).to.equal(ar._id);
    });

    it("can sync() for any future changes to the db", async () => {
      const ar: Person = <Person>ActiveRecordFactoryDependency.find("person", deps).create("people", {
        name: "a"
      });
      await ar.save();
      ar.sync();
      await broker.execute(new UpdateAction(ar.collectionName, { name: "b" }, { _id: ar._id }));
      expect(ar.name).to.equal("b");
      await broker.execute(new UpdateAction(ar.collectionName, { name: "c" }, { _id: ar._id }));
      expect(ar.name).to.equal("c");

    });

    it("emits a dispose action when the active record is removed", async () => {
      const ar: Person = <Person>ActiveRecordFactoryDependency.find("person", deps).create("people", {
        name: "a"
      });
      await ar.save();
      ar.sync();
      const executedActions = [];
      ar.observe({ execute: (action) => executedActions.push(action) });
      await broker.execute(new RemoveAction(ar.collectionName, { _id: ar._id }));
      expect(executedActions.length).to.equal(1);
      expect(executedActions[0].type).to.equal("dispose");
    });

    it("does not receive anymore sync actions after being disposed", async () => {
      const ar: Person = <Person>ActiveRecordFactoryDependency.find("person", deps).create("people", {
        name: "a"
      });
      await ar.save();
      ar.sync();
      await broker.execute(new UpdateAction(ar.collectionName, { name: "b" }, { _id: ar._id }));
      await timeout(50);
      expect(ar.name).to.equal("b");
      ar.dispose();
      await broker.execute(new UpdateAction(ar.collectionName, { name: "c" }, { _id: ar._id }));
      expect(ar.name).to.equal("b");
    });

    it("does not receive sync updates for other models", async () => {
      const ar: Person = <Person>ActiveRecordFactoryDependency.find("person", deps).create("people", {
        name: "a"
      });

      const ar2: Person = <Person>ActiveRecordFactoryDependency.find("person", deps).create("people", {
        name: "a2"
      });
      await ar.save();
      await ar2.save();
      ar.sync();
      ar2.sync();

      await broker.execute(new UpdateAction(ar.collectionName, { name: "b" }, { _id: ar._id }));
      await timeout(50);
      expect(ar.name).to.equal("b");
      expect(ar2.name).to.equal("a2");

      await broker.execute(new UpdateAction(ar.collectionName, { name: "b2" }, { _id: ar2._id }));
      expect(ar.name).to.equal("b");
      expect(ar2.name).to.equal("b2");
    });

    it("ignores DID_UPDATE if the post ds action timestamp is equal to or older than then model update timestamp", async () => {
      const ar: Person = <Person>ActiveRecordFactoryDependency.find("person", deps).create("people", {
        name: "a"
      });
      const oldDeserialize = ar.deserialize.bind(ar);
      let i = 0;
      ar.deserialize = (data: any) => {
        i++;
        return oldDeserialize(data);
      };
      await ar.save();
      ar.sync();
      expect(i).to.equal(1);
      ar.name = "b";
      await ar.save();
      expect(i).to.equal(2);
    });
  });

  describe("ActiveRecordCollection#", () => {
    it("can be created", () => {
      new ActiveRecordCollection(null);
    });
  });
});
