import { Collaborator } from "./collaborator";
import { 
  bubble, 
  bindable, 
  Observable, 
  ObservableCollection,
  Status
} from "@tandem/common"

export class CollaborateRootStore extends Observable {
  
  @bindable(true)
  public sharingStatus: Status = new Status(Status.IDLE);

  @bindable(true)
  @bubble()
  readonly collaborators: ObservableCollection<Collaborator> = ObservableCollection.create() as ObservableCollection<Collaborator>;


  getCollaborator(id: string) {
    const existing = this.collaborators.find(collaborator => collaborator.id === id);
    if (existing) return existing;
    this.collaborators.push(new Collaborator(id));
    return this.getCollaborator(id);
  }

  removeCollaborator(id: string) {
    const index = this.collaborators.findIndex(collaborator => collaborator.id === id)
    if (~index) this.collaborators.splice(index, 1);
  }
}