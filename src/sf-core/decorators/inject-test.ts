import { default as inject } from "./inject";
import { Dependencies, ClassFactoryDependency, Dependency, IInjectable } from "../dependencies";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can inject a simple string into a name prop", () => {
    class Person implements IInjectable {
      @inject("name")
      public name: string;

      didInject() {

      }
    }

    const dependencies = new Dependencies(
      new Dependency<string>("name", "bob"),
      new ClassFactoryDependency("person", Person)
    );

    const personDep = dependencies.query<ClassFactoryDependency>("person");
    expect(personDep.create().name).to.equal("bob");
  });
});