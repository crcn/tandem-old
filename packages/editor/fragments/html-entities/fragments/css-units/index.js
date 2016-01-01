import { UnitFragment } from 'editor/fragment/types';

export function create({ app }) {
  return ['px', 'pt', 'cm', 'mm', '%', 'em'].map(
    UnitFragment.create.bind(UnitFragment)
  );
}