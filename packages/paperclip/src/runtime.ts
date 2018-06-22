import { DependencyGraph, Dependency } from "./graph";
import { EventEmitter } from "events";
import { SyntheticDocument, generateSyntheticDocumentChecksum, setDocumentChecksum } from "./synthetic";
import { evaluatePCModule } from "./evaluate";
import { KeyValue, TreeNode } from "tandem-common";
import { patchTreeNode, TreeNodeOperationalTransform, diffTreeNode, createSetNodePropertyOperationalTransform } from "./ot";
import { PCModule, PCNode, createPCDependency } from "./dsl";

export interface PCRuntime extends EventEmitter {
  graph: DependencyGraph;
  readonly syntheticDocuments: SyntheticDocument[];
  on(event: "dependencyUpdated", listener: (dependency: Dependency<any>, graph: DependencyGraph) => void): this;
  on(event: "evaluate", listener: (newDocuments: KeyValue<SyntheticDocument>, diffs: KeyValue<TreeNodeOperationalTransform[]>, deletedDocumentIds: string[]) => void): this;
}

class LocalPCRuntime extends EventEmitter implements PCRuntime {
  private _evaluating: boolean;
  private _graph: DependencyGraph;
  private _syntheticDocuments: KeyValue<SyntheticDocument>;

  constructor(graph?: DependencyGraph) {
    super();
    this._syntheticDocuments = {};
    if (graph) {
      this.graph = graph;
    }
  }

  set graph(value: DependencyGraph) {
    if (this._graph === value) {
      return;
    }
    this._graph = value;
    this._evaluate();
  }

  get graph() {
    return this._graph;
  }

  private _evaluate() {
    if (this._evaluating) {
      return;
    }
    this._evaluating = true;

    // This is primarily here to prevent synchronous access
    // synthetic objects after dependency graph patching
    setImmediate(() => {
      this._evaluating = false;
      this._evaluateNow();
    });
  }

  get syntheticDocuments(): SyntheticDocument[] {
    return Object.values(this._syntheticDocuments);
  }

  private _evaluateNow() {
    const now = Date.now();
    const diffs: KeyValue<TreeNodeOperationalTransform[]> = {};
    const newDocuments: KeyValue<SyntheticDocument> = {};
    const newDocumentMap = {};
    const deletedDocumentIds = [];

    for (const uri in this._graph) {
      const dependency = this._graph[uri];
      const syntheticDocument = evaluatePCModule(dependency.content, this._graph);
      let documentMapItem = this._syntheticDocuments[uri];
      if (documentMapItem) {
        const ots = diffTreeNode(documentMapItem, syntheticDocument);
        if (ots.length) {
          this._syntheticDocuments[uri] = documentMapItem = setDocumentChecksum(patchTreeNode(ots, documentMapItem));
          diffs[uri] = [createSetNodePropertyOperationalTransform([], "checksum", documentMapItem.checksum),...ots];
        }
      } else {
        newDocuments[uri] = documentMapItem = setDocumentChecksum(syntheticDocument);
      }

      newDocumentMap[uri] = documentMapItem;
    }

    for (const uri in this._syntheticDocuments) {
      if (!newDocumentMap[uri]) {
        deletedDocumentIds.push(uri);
      }
    }

    this._syntheticDocuments = newDocumentMap;

    console.log("evaluated dependency graph in %d ms", Date.now() - now);
    this.emit("evaluate", newDocuments, diffs, deletedDocumentIds);
  }
}

export type DependencyGraphChanges = KeyValue<PCModule | TreeNodeOperationalTransform[]>;

export type RemoteConnection = {
  addEventListener(type: "message", listener: any): any;
  postMessage(message: Object): any;
}

export class RemotePCRuntime extends EventEmitter implements PCRuntime {
  private _graph: DependencyGraph;
  private _syntheticDocuments: KeyValue<SyntheticDocument>;
  constructor(private _remote: RemoteConnection, graph?: DependencyGraph) {
    super();

    if (graph) {
      this.graph = graph;
    }

    this._remote.addEventListener("message", this._onRemoteMessage);
    this._remote.postMessage({type: "fetchAllSyntheticDocuments"});
  }

  get syntheticDocuments() {
    return Object.values(this._syntheticDocuments);
  }

  get graph() {
    return this._graph;
  }

  set graph(value: DependencyGraph) {
    if (this._graph === value) {
      return;
    }
    const oldGraph = this._graph;
    this._graph = value;

    const changes = {};

    for (const uri in value) {
      const oldDep = oldGraph[uri];
      if (oldDep) {
        const ots = diffTreeNode(oldDep.content, value[uri].content);
        changes[uri] = ots;
      } else {
        changes[uri] = value[uri].content;
      }
    }

    if (Object.keys(changes).length) {
      this._remote.postMessage({ type: "dependencyGraphChanges", payload: changes });
    }
  }

  private _onRemoteMessage = (event) => {
    const { type, payload } = event.data;
    if (type === "fetchDependencyGraph") {
      this._remote.postMessage({ type: "dependencyGraph", payload: this._graph });
    } else if (type === "evaluate") {
      const [newDocuments, diffs, deletedDocumentUris] = payload;
      this._syntheticDocuments = {
        ...this._syntheticDocuments,
        ...newDocuments
      };

      for (const uri in diffs) {
        this._syntheticDocuments[uri] = patchTreeNode(diffs[uri], this._syntheticDocuments[uri]);
      }

      for (const uri of deletedDocumentUris) {
        delete this._syntheticDocuments[uri];
      }

      this.emit("evaluate", newDocuments, diffs, deletedDocumentUris);
    } else if (type === "allSyntheticDocuments") {
      this._syntheticDocuments = payload;
      this.emit("evaluate", payload, {}, []);
    }
  };
}

export const createLocalPCRuntime = (initialGraph?: DependencyGraph) => new LocalPCRuntime(initialGraph);
export const createRemotePCRuntime = (remote: RemoteConnection, initialGraph?: DependencyGraph)  => new RemotePCRuntime(remote, initialGraph);

const patchDependencyGraph = (changes: DependencyGraphChanges, oldGraph: DependencyGraph) => {
  let newGraph = {};
  for (const uri in changes) {
    const change = changes[uri];
    if (Array.isArray(change)) {
      newGraph[uri] = change.length ? createPCDependency(uri, patchTreeNode(change, oldGraph[uri].content)) : oldGraph[uri];
    } else {
      newGraph[uri] = createPCDependency(uri, change);
    }
  }

  return newGraph;
};

export const hookRemotePCRuntime = async (localRuntime: PCRuntime, remote: RemoteConnection) => {
  let _sentDocuments = false;

  const sendDocuments = () => {
    _sentDocuments = true;
    remote.postMessage({ type: "allSyntheticDocuments", payload: localRuntime.syntheticDocuments });
  };

  remote.addEventListener("message", (event) => {
    const { type, payload } = event.data;
    if (type === "fetchAllSyntheticDocuments") {
      sendDocuments();
    } else if (type === "dependencyGraph") {
      localRuntime.graph = payload;
    } else if (type === "dependencyGraphChanges") {
      localRuntime.graph = patchDependencyGraph(payload, localRuntime.graph);
    }
  });

  remote.postMessage({ type: "fetchDependencyGraph" });

  localRuntime.on("evaluate", (...args) => {
    if (_sentDocuments) {
      remote.postMessage({ type: "evaluate", payload: args });
    } else {
      sendDocuments();
    }
  });
};