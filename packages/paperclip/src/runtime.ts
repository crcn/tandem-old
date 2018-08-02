import { DependencyGraph, Dependency } from "./graph";
import { EventEmitter } from "events";
import { SyntheticDocument } from "./synthetic";
import { evaluatePCModule2 } from "./evaluate2";
import { KeyValue, TreeNode } from "tandem-common";
import {
  patchTreeNode,
  TreeNodeOperationalTransform,
  diffTreeNode,
  createSetNodePropertyOperationalTransform
} from "./ot";
import { PCModule, PCNode, createPCDependency } from "./dsl";

export interface PCRuntime extends EventEmitter {
  getGraph(): DependencyGraph;
  setGraph(value: DependencyGraph, timestamp?: number);
  readonly syntheticDocuments: SyntheticDocument[];
  readonly lastUpdatedAt: number;
  on(
    event: "dependencyUpdated",
    listener: (dependency: Dependency<any>, graph: DependencyGraph) => void
  ): this;
  on(
    event: "evaluate",
    listener: (
      newDocuments: KeyValue<SyntheticDocument>,
      diffs: KeyValue<TreeNodeOperationalTransform[]>,
      deletedDocumentIds: string[],
      timestamp: number
    ) => void
  ): this;
}

class LocalPCRuntime extends EventEmitter implements PCRuntime {
  private _evaluating: boolean;
  private _graph: DependencyGraph;
  private _lastUpdatedAt: number;
  private _syntheticDocuments: KeyValue<SyntheticDocument>;

  constructor(graph?: DependencyGraph) {
    super();
    this._syntheticDocuments = {};
    if (graph) {
      this.setGraph(graph);
    }
  }

  get lastUpdatedAt() {
    return this._lastUpdatedAt;
  }

  setGraph(value: DependencyGraph, timestamp: number = Date.now()) {
    if (this._graph === value) {
      return;
    }
    this._lastUpdatedAt = timestamp;
    this._graph = value;
    this._evaluate();
  }

  getGraph() {
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
    const newDocumentMap: KeyValue<SyntheticDocument> = {};
    const documentMap = {};
    const deletedDocumentIds = [];

    for (const uri in this._graph) {
      const dependency = this._graph[uri];
      const syntheticDocument = evaluatePCModule2(
        dependency.content,
        this._graph
      );
      let documentMapItem = this._syntheticDocuments[uri];
      if (documentMapItem) {
        documentMap[uri] = documentMapItem;
        const ots = diffTreeNode(documentMapItem, syntheticDocument);
        if (ots.length) {
          documentMapItem = documentMap[uri] = patchTreeNode(
            ots,
            documentMapItem
          );
          diffs[uri] = ots;
        } else {
          documentMap[uri] = documentMapItem;
        }
      } else {
        newDocumentMap[uri] = documentMap[uri] = syntheticDocument;
      }
    }

    for (const uri in this._syntheticDocuments) {
      if (!documentMap[uri]) {
        deletedDocumentIds.push(uri);
      }
    }

    this._syntheticDocuments = documentMap;

    console.log("evaluated dependency graph in %d ms", Date.now() - now);

    this.emit(
      "evaluate",
      newDocumentMap,
      diffs,
      deletedDocumentIds,
      this._lastUpdatedAt
    );
  }
}

export type DependencyGraphChanges = KeyValue<
  PCModule | TreeNodeOperationalTransform[]
>;

export type RemoteConnection = {
  addEventListener(type: "message", listener: any): any;
  postMessage(message: Object): any;
};

export class RemotePCRuntime extends EventEmitter implements PCRuntime {
  private _graph: DependencyGraph;
  private _syntheticDocuments: KeyValue<SyntheticDocument>;
  private _lastUpdatedAt: number;
  constructor(private _remote: RemoteConnection, graph?: DependencyGraph) {
    super();

    if (graph) {
      this.setGraph(graph);
    }

    this._remote.addEventListener("message", this._onRemoteMessage);
    this._remote.postMessage({ type: "fetchAllSyntheticDocuments" });
  }
  get lastUpdatedAt() {
    return this._lastUpdatedAt;
  }

  get syntheticDocuments() {
    return Object.values(this._syntheticDocuments);
  }

  getGraph() {
    return this._graph;
  }

  setGraph(value: DependencyGraph, timestamp: number = Date.now()) {
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
      this._remote.postMessage({
        type: "dependencyGraphChanges",
        payload: { changes, lastUpdatedAt: (this._lastUpdatedAt = timestamp) }
      });
    }
  }

  private _onRemoteMessage = event => {
    const { type, payload } = event.data;
    if (type === "fetchDependencyGraph") {
      this._remote.postMessage({
        type: "dependencyGraph",
        payload: this._graph
      });
    } else if (type === "evaluate") {
      const [newDocuments, diffs, deletedDocumentUris, timestamp] = payload;
      this._syntheticDocuments = {
        ...this._syntheticDocuments,
        ...newDocuments
      };

      for (const uri in diffs) {
        this._syntheticDocuments[uri] = patchTreeNode(
          diffs[uri],
          this._syntheticDocuments[uri]
        );
      }

      for (const uri of deletedDocumentUris) {
        delete this._syntheticDocuments[uri];
      }

      this.emit(
        "evaluate",
        newDocuments,
        diffs,
        deletedDocumentUris,
        timestamp
      );
    } else if (type === "allSyntheticDocuments") {
      this._syntheticDocuments = payload;
      this.emit("evaluate", payload, {}, [], Date.now());
    }
  };
}

export const createLocalPCRuntime = (initialGraph?: DependencyGraph) =>
  new LocalPCRuntime(initialGraph);
export const createRemotePCRuntime = (
  remote: RemoteConnection,
  initialGraph?: DependencyGraph
) => new RemotePCRuntime(remote, initialGraph);

const patchDependencyGraph = (
  changes: DependencyGraphChanges,
  oldGraph: DependencyGraph
) => {
  let newGraph = {};
  for (const uri in changes) {
    const change = changes[uri];
    if (Array.isArray(change)) {
      newGraph[uri] = change.length
        ? createPCDependency(uri, patchTreeNode(change, oldGraph[uri].content))
        : oldGraph[uri];
    } else {
      newGraph[uri] = createPCDependency(uri, change);
    }
  }

  return newGraph;
};

export const hookRemotePCRuntime = async (
  localRuntime: PCRuntime,
  remote: RemoteConnection
) => {
  let _sentDocuments = false;

  const sendDocuments = () => {
    _sentDocuments = true;
    remote.postMessage({
      type: "allSyntheticDocuments",
      payload: localRuntime.syntheticDocuments
    });
  };

  remote.addEventListener("message", event => {
    const { type, payload } = event.data;
    if (type === "fetchAllSyntheticDocuments") {
      sendDocuments();
    } else if (type === "dependencyGraph") {
      localRuntime.setGraph(payload);
    } else if (type === "dependencyGraphChanges") {
      localRuntime.setGraph(
        patchDependencyGraph(payload.changes, localRuntime.getGraph()),
        payload.lastUpdatedAt
      );
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
