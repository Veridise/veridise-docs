---
title: Getting Started
sidebar_position: 1
---

After gaining access to SaaS, you will be able to use Veridise tools available for your organization. 


### Select Project

A project is an associated set of source files such as (but may not always be) a github repository that a user wishes to analyze. 
The user can upload multiple versions of her source code, and run any of the available tools with a single version as input.

To create a project, click the `New Project` button and provide name for your new project.

![image](../screenshots/project-page.png)
![image](../screenshots/new-project.png)

### Upload source code

Select your target project and go to the `Versions` tab. Click the `+` button to upload a new version of your source code.

![image](../screenshots/new-version.png)

Create a zip archive containing tour source code. When uploading your archive, you have to select the path of the source code. Use the drag and drop feature from the directory listing on the right side of the screen.
You may also provide an include path and/or a specs path, if available in your archive.
An include path, is a path containing required dependencies your your source code, such as node modules.
More information for VSpecs that may be included in specs path can be found [here](../orca/user_guide/v/contract_initialization).

**TODO: setup dedicated doc page for VSpec and link it ? **

![image](../screenshots/upload-version.png)


### Tool execution

To analyze your source code with our tools go to the `Task Wizard` tab.
Select the target source code version, or upload a new.

![image](../screenshots/task-wizard.png)


Then select the platform you would like to test, and the language of your source code. 

![image](../screenshots/language.png)


According to your selection in the previous step, you are able to select any tool that is available to your organization, and supports the selected language and platform. 

![image](../screenshots/tool.png)

Next steps include further configuration options, according to the selected tool.
For more information on configuring any of our tools go the tool's documentation page ( [OrCa](../orca/getting_started/running_orca_through_saas#orca-configuration) and [Vanguard](../vanguard) )

Finally, review your choices, optionally select a task name, and submit your task for execution.

![image](../screenshots/review.png)

### Task details

When creating a task, you will be redirected to the `Task Details` page.
The logs of the task will be available there as its progressing, along with the selected configuration options.

Note that in this page you are also able to cancel the task execution, or copy the configuration to start a new task.

![image](../screenshots/task-run.png) 

### Task results

In the `Task Results` tab you are able to check the status of all tasks, and by selecting any of them you can go back to the task details page.

![image](../screenshots/task-results.png) 