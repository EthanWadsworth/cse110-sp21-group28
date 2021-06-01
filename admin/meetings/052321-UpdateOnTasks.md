# Notes for Sunday, May 23th, Update on Tasks meeting
Team Number: 28  
Team Name: Spicy Ocelots   
Type of meeting: Update on Tasks meeting.   
Group Members absent: All Present.    
Zoom meeting at 6 PM PST: Sunday, May 23th   

## Objective for Today
Today, our goal was to go over the second checkpoint about the CI/CD Pipeline and quickly update each other what has been finished. In addition, we also went over how to use the backend functions created by Ethan and Dave.


## Agenda
1. Talk about tasks due for the week.
2. CI/CD Pipeline 2nd Checkpoint
3. Since Sign Up and Sign in is done, Jacob and Abhishek are to be relocated
4. Questions

## Meeting Notes
- Wait for a couple of minutes to ensure that everyone joins before we get started with the meeting.

### CI/CD Pipeline Update
- When pushing changes to github, first merge to staging branch. 
- Then in staging branch, use our tests and github actions set up, then once that is cleared, merge with main
- Thus, we use github action to run tests and then it will be deployed to server
- 2nd Checkpoint: Create actual tests for each feature by Tuesday
- Each team member should create tests based on our current features

### Brief Update on Each Team
###### Ethan W. and Dave team
- Met with Edward and Allen's team and figured out how pages should connect with each other
- Currently, they need to fix the CSS file to make sure that it matches what we had proposed before

###### Backend
- Ethan and Dave met with both Ethan, Edward, and Allen to restyle how database and methods in scripts.js file are set up.
- If needed, we can edit them to match what each team needs to interact with the database

###### Showcasing the database
- scripts.js interacts with database and has methods to help each group
- Plan to index by name of the bullet journal
- createNewUser method creates new entry and stores information below the entry in database
- Add new tags and delete tags based on user, journal ID, and specific tag
- Todo, new entries, get all journals, getAll entries are each methods that we can use

###### How to use database:
- Import script.js and grab inputs, and call functions from the script.js
- Use queryselectors to get elements and use those values for inputs into each of the methods
- From there, using event listeners based on clicks, we can use the methods that we need.

### Things to remember
- On Github, create issues and assign them with labels before pushing code (NOT DIRECTLY INTO MAIN)
- Custom tags were created such as priority, status, etc.

## Current Timeline and thoughts for the week
- Agile Sprint meeting number 2
- Agile Retrospective
- Start to connect each team's work together
- We will talk more during the week and in our next meetings.   
Finished meeting on Sunday, May 23th at 6:30 PM.  
