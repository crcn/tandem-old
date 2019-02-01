const {Command} = require('commander');
const {start: install} = require('./install');
const {start: init} = require('./init');


exports.start = (argv) => {
  const program = new Command();

  // program._name = 'tandem';


  program
  .command('help')
  .description('Shows CLI help and exits')
  .action(() => {
    program.help();
  });

  program
  .command('install')
  .description('install the latest version of Tandem')
  .action(install);

  program
  .command('init')
  .description('Create a new project')
  .action(init);


  program.parse(argv);
}
