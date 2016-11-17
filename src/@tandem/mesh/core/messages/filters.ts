import { getMessageVisitors, getMessageTarget } from "./decorators";

export const filterFamilyMessage = (message: any, fromFamily: string, toFamily: string) => {

  const targetFamily    = getMessageTarget(message);
  const visitorFamilies = getMessageVisitors(message);

  if (targetFamily === fromFamily) return false;
  return targetFamily === toFamily || visitorFamilies.indexOf(toFamily);
}