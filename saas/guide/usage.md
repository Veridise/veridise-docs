---
title: Getting Started
sidebar_position: 2
---

After gaining access to AuditHub, you will be able to use Veridise tools available for your organization. 


### Create a Project

A project is an associated set of source files such as (but may not always be) a github repository that a user wishes to analyze. 
The user can upload multiple versions of her source code, and run any of the available tools with a single version as input.

To create a project, click the `New Project` button. The new project wizard will guide to setup all required project information along with the initial project version.

![image](../screenshots/project_page.png)



* Select a name for your new project. This is a unique name across your organization

![image](../screenshots/project_name.png)

* Select how you will load the data of your initial version. There are three supported options:
    * An archive file you upload from your machine
    * A git repository, which is publicly accessible
    * A public url for your archive

![image](../screenshots/project_source_location.png)

* Select the root path directory for your project. This is the folder where we run build system commands (Foundry, Hardhat, etc.)

![image](../screenshots/project_root.png)

* Select the basic paths of your project. These are:
    * Source path: The folder containing the sources of your project.
    * Include path: The folder containing the dependencies of your project, if exist.
    * [V] Specs path: The folder containing V Specifications to be used by our fuzzer (OrCa), if exist.

![image](../screenshots/project_paths.png)

* Select what types of code your project contains. According to your selection different tools will be available to validate your sources.

![image](../screenshots/project_contents.png)

* Select your project dependencies. We support installation of your project's dependencies using:
    * npm
    * yarn
    * pnpm 

You can also use a lockfile, if this is included in the sources. Finally, you are able to select the node version to be used during dependencies' installation. 

* Select build system, if supported by your project, and environment variables that should be supplied during the build step. Currently we support:
    * Foundry
    * Hardhat - Legacy, which is the initial hardhat offering
    * Hardhat - Ignition, which is the latest hardhat offering
In all these options, you have to provide the path of your deployment script. 

![image](../screenshots/project_build.png)  

* Review your selection and save the project

![image](../screenshots/project_review.png)

* As soon as you save the project you are redirected to the project dashboard. This is where you can:
    1. View the contents of your project
    2. Select the version you are viewing or upload a new one
    3. Start the execution of a new task
    4. View or create new [V] Specs
    5. View findings reported after the execution of our security tools
    6. For each such finding view further details and perform actions on it
    7. Start new discussion threads on the code and the findings

![image](../screenshots/project_viewer.png)


### Tool execution

To analyze your source code with our tools go to the `+` button on the right of the task list. The task wizard will guide towards creating a new task.

![image](../screenshots/task_new.png)

* Select the target source code version, or upload a new.

![image](../screenshots/task_version.png)

* Select the tool to run. The tools listed are those available to your organization, that support the contents (e.g. solidity, circom) of  your project. 

![image](../screenshots/task_tool.png)

* Make the required tool specific configuration. 
For more information on configuring any of our tools please visit the corresponding tool's documentation page


![image](../screenshots/task_tool_config.png)

* Optionally select a name for your task, review your selections and submit the task

![image](../screenshots/task_review.png)


### Task details

When creating a task, you will be redirected to the `Task View` page. 

![image](../screenshots/task_view.png) 

The task consists of multiple steps that are executed either serially or parallel, according to their dependencies.
There are details about:
1. The configuration settings of the tool, as selected in previous step
2. The status of the task and its creation and completion date
3. The status of each step along with the possibility to expand it and view the step's logs.

Moreover, there is functionality to:
1. Cancel the task execution
2. Resubmit a task with the same configuration
3. Download the version this task used to run
4. Download the extended version. This os the selected version, augmented with tool's artifacts and potentially installed node dependencies.

![image](../screenshots/task_details.png) 

When the task is completed you will also be able to see the number of detected findings, if any, grouped by severity level.

![image](../screenshots/task_findings.png) 

### Project findings

When a project has findings detected by our tools, these are displayed on the bottom left part of the screen. By selecting a row, you can see the finding's details on the bottom right part of the screen.

![image](../screenshots/project_findings.png) 

Any finding has a list of available actions. You can check the available options and select to apply the action. Optionally, you can provide a comment.

![image](../screenshots/finding_action.png) 


### Collaborative commenting
 AuditHub supports collaborative commenting.
 Currently this is supported for source code lines and findings.

By opening a source file and clicking in the row number you can start a new discussion on a source code line.
![image](../screenshots/project_sources_commenting.png) 

By clicking the message icon on the finding's details you can start a new discussion on a finding.

![image](../screenshots/finding_collaborative_commenting.png) 
