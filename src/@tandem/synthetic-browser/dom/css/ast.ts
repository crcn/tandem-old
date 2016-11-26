import { ISourceLocation } from "@tandem/common";

export enum DeclValueExpressionKind {
  IDENTIFIER  = 1,
  URL         = IDENTIFIER + 1,
  NUMBER      = URL + 1,
  COMMA_LIST  = NUMBER + 1,
  SPACE_LIST  = COMMA_LIST + 1,
  MEASUREMENT = SPACE_LIST + 1,
  DEGREE      = MEASUREMENT + 1,
  STRING      = DEGREE + 1,
  CALL        = STRING + 1,
  COLOR       = CALL + 1,
  BINARY      = COLOR + 1
}

export class DeclValueExpression {
  constructor(readonly kind: DeclValueExpressionKind, readonly location: ISourceLocation) {

  }
}

export class DeclURLExpression extends DeclValueExpression {
  constructor(readonly value: string, location: ISourceLocation) {
    super(DeclValueExpressionKind.URL, location);
  }
}

export class DeclColorExpression extends DeclValueExpression {
  constructor(readonly value: string, location: ISourceLocation) {
    super(DeclValueExpressionKind.COLOR, location);
  }
}

export class DeclIdentifierExpression extends DeclValueExpression {
  constructor(readonly value: string, location: ISourceLocation) {
    super(DeclValueExpressionKind.IDENTIFIER, location);
  }
  toString() {
    return this.value;
  }
}

export class DeclListExpression extends DeclValueExpression {
  constructor(kind: DeclValueExpressionKind, readonly items: DeclValueExpression[], location: ISourceLocation) {
    super(kind, location);
  }
}

export class DeclCommaListExpression extends DeclListExpression {
  constructor(items: DeclValueExpression[], location: ISourceLocation) {
    super(DeclValueExpressionKind.COMMA_LIST, items, location);
  }
}

export class DeclSpaceListExpression extends DeclListExpression {
  constructor(items: DeclValueExpression[], location: ISourceLocation) {
    super(DeclValueExpressionKind.SPACE_LIST, items, location);
  }
}

export class DeclNumberExpression extends DeclValueExpression {
  constructor(readonly value: number, location: ISourceLocation) {
    super(DeclValueExpressionKind.NUMBER, location);
  }
}

export class DeclMeasurementExpression extends DeclValueExpression {
  constructor(readonly value: number, readonly unit: string, location: ISourceLocation) {
    super(DeclValueExpressionKind.MEASUREMENT, location);
  }
}

export class DeclDegreeExpression extends DeclValueExpression {
  constructor(readonly value: number, location: ISourceLocation){
    super(DeclValueExpressionKind.DEGREE, location);
  }
}

export class DeclStringExpression extends DeclValueExpression {
  constructor(readonly value: string, location: ISourceLocation){
    super(DeclValueExpressionKind.STRING, location);
  }
}

export class DeclCallExpression extends DeclValueExpression {
  constructor(readonly identifier: DeclValueExpression, readonly params: DeclValueExpression[], location: ISourceLocation) {
    super(DeclValueExpressionKind.CALL, location);
  }
}