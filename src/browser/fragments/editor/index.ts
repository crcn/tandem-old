import FactoryFragment from 'common/fragments/Factory';

export default FactoryFragment.create(
  'application/mainComponent',
  { create: create }
);

function create() {
  console.log('making this');
}

