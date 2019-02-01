const {templates} = require("tandem-starter-kits");
const inquirer = require("inquirer");

exports.start = async (argv, cwd) => {
  const template = await pickTemplate();
};  

const pickTemplate = async () => {
  const {value} = await inquirer.prompt([
    {
      type: 'list',
      name: 'value',
      message: 'What framework are you using?',
      choices: templates.map(({label, id}) => ({
        name: label,
        value: id
      }))
    },
    
  ]);

  console.log(value);

};

