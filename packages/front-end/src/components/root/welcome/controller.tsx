import * as React from "react";
import {
  openProjectButtonClicked,
  createProjectButtonClicked
} from "../../../actions";
import { BaseWelcomeProps, ProjectPill } from "./view.pc";
import { Dispatch } from "redux";
import {
  StartKitOptions,
  templates,
  hasOptionForm,
  createProjectFiles
} from "../../../starter-kits";
import { ProjectTemplate } from "../../../state";

export type Props = {
  dispatch: Dispatch<any>;
};

enum Page {
  START = "start",
  CREATE_PROJECT = "createProject",
  NEW_PROJECT_OPTIONS = "newProjectOptions"
}

type State = {
  page: Page;
  selectedTemplate?: ProjectTemplate;
};

export default (Base: React.ComponentClass<BaseWelcomeProps>) =>
  class WelcomeController extends React.PureComponent<Props, State> {
    state = {
      page: Page.START,
      selectedTemplate: null
    };

    onOpenProjectButtonClick = () => {
      this.props.dispatch(openProjectButtonClicked());
    };
    onCreateProjectButtonClick = () => {
      this.setState({ page: Page.CREATE_PROJECT });
    };

    onPillClick = (selectedTemplate: ProjectTemplate) => {
      this.props.dispatch(
        createProjectButtonClicked(createProjectFiles(selectedTemplate.id, {}))
      );

      // todo later on
      // if (hasOptionForm(selectedTemplate.id)) {
      //   this.setState({ page: Page.NEW_PROJECT_OPTIONS, selectedTemplate });
      // } else {
      //   console.log("FINISH");
      // }
    };

    onOptionsChange = (options: Object) => {
      console.log("OPTIONS");
    };

    render() {
      const {
        onOpenProjectButtonClick,
        onCreateProjectButtonClick,
        onPillClick,
        onOptionsChange
      } = this;
      const { page, selectedTemplate } = this.state;
      const options = templates.map(template => {
        return (
          <ProjectPill
            onClick={() => onPillClick(template)}
            labelProps={{ text: template.label }}
            icon={template.icon && <img src={template.icon} />}
          />
        );
      });
      return (
        <Base
          variant={page}
          openProjectButtonProps={{ onClick: onOpenProjectButtonClick }}
          createProjectButtonProps={{ onClick: onCreateProjectButtonClick }}
          options={options}
          newProjectOptions={
            page === Page.NEW_PROJECT_OPTIONS ? (
              <StartKitOptions
                template={selectedTemplate}
                onChangeComplete={onOptionsChange}
              />
            ) : null
          }
        />
      );
    }
  };
