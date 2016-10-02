import { IActor } from "@tandem/common/actors";
import { WrapBus } from "mesh";
import { bindable } from "@tandem/common/decorators";
import { IDisposable } from "@tandem/common/object";
import { patchTreeNode } from "@tandem/common/tree";
import { IASTNodeSource, IASTNode } from "./base";
import { Action, EntityLoaderAction } from "@tandem/common/actions";
import { IObservable, Observable, watchProperty } from "@tandem/common/observable";

export abstract class BaseASTNodeLoader extends Observable {

  private _source: IASTNodeSource;
  private _expression: IASTNode;
  private _contentWatcher: IDisposable;
  private _expressionObserver: IActor;
  private _content: string;
  private _options: any;

  constructor() {
    super();
    this._expressionObserver = new WrapBus(this.onExpressionAction.bind(this));
    this.options = {};
  }

  public get options(): any {
    return this._options;
  }

  public set options(value: any) {
    this._options = Object.assign({}, this.getDefaultOptions(), value);
  }

  public get source(): IASTNodeSource {
    return this._source;
  }

  public get expression(): IASTNode {
    return this._expression;
  }

  load(source: IASTNodeSource) {
    if (this._source) {
      this._contentWatcher.dispose();
    }

    this._source = source;

    this._contentWatcher  = watchProperty(this._source, "content", this.onSourceContentChange.bind(this));

    return this.parse();
  }

  protected onSourceContentChange(newContent: string, oldContent: string) {
    this.parse();
  }

  protected abstract parseContent(content: string): IASTNode;

  protected onExpressionAction(action: Action) {
    this.source.content = this.createFormattedSourceContent(action);
    this.parse();
    this.notify(new EntityLoaderAction(EntityLoaderAction.ENTITY_CONTENT_FORMATTED));
  }

  protected createFormattedSourceContent(action: Action) {
    return this._expression.toString();
  }

  private parse(): IASTNode {

    if (this._content === this.source.content) {
      return;
    }

    let newExpression: IASTNode;

    try {
      newExpression = this.parseContent(this._content = this.source.content);
    } catch (e) {
      console.error(e.stack);
      return;
    }

    newExpression.source = this._source;

    if (this._expression) {
      this._expression.unobserve(this._expressionObserver);
      patchTreeNode(this._expression, newExpression);
      this._expression.observe(this._expressionObserver);
    } else {
      this._expression = newExpression;
      this._expression.observe(this._expressionObserver);
    }

    return this._expression;
  }

  protected getDefaultOptions() {
    return {};
  }
}