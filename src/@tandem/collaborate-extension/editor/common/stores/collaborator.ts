import { 
  IPoint,
  bubble,
  bindable,
  Observable, 
  serializable
} from "@tandem/common";


@serializable("Collaborator", {
  serialize({ id, mousePosition, displayName }: Collaborator) {
    return [id, mousePosition, displayName]
  },
  deserialize([id, mousePosition, displayName]) {
    return new Collaborator(id, displayName, mousePosition);
  }
})
export class Collaborator extends Observable {

  constructor(id: string, displayName?: string, mousePosition?: IPoint) {
    super();
    this.id            = id;
    this.displayName   = displayName;
    this.mousePosition = mousePosition;
  }

  /**
   */

  @bindable(true)
  @bubble()
  id: string;

  /**
   */
  
  @bindable(true)
  @bubble()
  mousePosition: IPoint;

  /**
   */

  @bindable(true)
  @bubble()
  displayName: string = "Anonymous";
}