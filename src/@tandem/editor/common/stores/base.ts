import { 
  inject,
  Kernel, 
  Observable, 
  IBrokerBus,
  KernelProvider, 
  PrivateBusProvider,
} from "@tandem/common";

export class BaseEditorStore extends Observable {
  @inject(KernelProvider.ID)
  protected kernel: Kernel;

  @inject(PrivateBusProvider.ID)
  protected bus: IBrokerBus;
}