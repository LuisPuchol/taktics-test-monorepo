# Taktics Test Monorepo
This monorepo has 2 projects:

* A front-end made in angular 1.5.8
* A back-end made in loopback 3

# Test Requirements
The project needs a way to handle budgets made by the users.

A budget has the following structure:

* A name
* A thumbnail, an image. This image must be uploaded to Amazon S3 and be visible from the list and the detail pages
* A date
* A client name
* A total cost import (will be the sum of all chapters total cost)
* A total sale import (will be the sum of all chapters total sale)
* A list of chapters and batches

A chapter has the following fields:

* A rank that determines the chapter position in the budget
* A description
* 2 sale coefficiens (material and labour). A sale coefficient its a margin gained to the cost, for example a sale coefficient of 1.5 on 300€ cost will produce a 450€ sale
* A total cost import (will be the sum of all batches total cost)
* A total sale import (will be the sum of all batches total sale)

A batch has the following fields:

* A rank that determines the batch position inside the chapter
* A description
* An amount
* A material cost import
* A labour cost import
* An unitary cost import that will be the sum of material and labour cost
* A total cost import that will be unitary cost times amount
* An unitary sale cost that will be the sum of material and labour cost with the corresponding sale coefficients
* A total sale import that will be the unitary sale times amount


So a new section "Budgets" on the sidebar must be created. This section will lead to a new view that will render an upper part with 3 filters: by name, by client name and by a range of dates; and on the bottom part a list with all the budgets (will show all the fields as columns, the thumbnail must be a column too) filtered by the filters.

Every budget will have 2 actions: edit budget and delete budget.

When editing the budget, will open a detail of the budget. This budget detail view has 2 sections:

* An upper on that will display the budget fields as a nice form (needs to be editable, only the ones that aren't a calculus result)
  * There must be a way to see the thumbnail and be able to delete it or upload a new one
* A bottom one that will display a table with the chapters and batches of the budgets. The fields that aren't formulas will be editable and will upadte all the fields that are calculations (batch -> chapter -> budget). It needs to have a visual indicator that differenciates what's a chapter and what's a batch. Finally, this table will have the following actions:

  * Create a chapter, will add a chapter
  * Delete a chapter, will delete a chapter and its child batches
  * Create a batch inside a chapter
  * Delete a batch inside a chapter

When deleting the budget, will show a modal warning the user that the budget will be deleted. If the user selects "Accept", the budget will be deleted. If the user selects "Cancel", the modal will be closed.

Finally the las action of the budgets table will be a create one that will open the same view as the edit budget but to create a new one.

# Test Duration
After you received the email with the instructions you will have 48 hours to deliver this test. Deliver it later and you will be discualified

# Delivering Instructions
In order to deliver this test you will create a private repo on your provider of choice (Github, Gitlab, ...), include jplaza@taktics.net as a user capable of cloning the solution and reply the email sended to you with the link to access to the solution repository.