import FactoryFragment from 'common/fragments/Factory';

export default FactoryFragment.create(
  'application/mainComponent',
  { create: create }
);

function create({ application }: any) {
  console.log('making this', application.element);
  application.element.innerHTML = 'hello';
}

