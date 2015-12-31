import {
    ApplicationFragment,
    FactoryFragment
} from 'editor/fragment/types';

/**
 * selection handler whenever a user focuses on a given entity
 */

export default ApplicationFragment.create({
    id: 'appSelection',
    factory: {
        create: create
    }
});


function create({ app }) {
    console.log('create selection');
}