# Notes from the First Sprint Review Meeting
Date: Sunday, May 16th, 2021.      
Members Present: All Members.      
Time Started: 6 PM.   

## Agenda and Order of Presentations
1. Ethan W. and Dave J. (Entry page of the Bullet Journal after sign in)
2. Allen and Edward  (Daily and Weekly Todo and individual bullet journal)
3. Frank, Jacob, and Abhishek (Sign In and Sign Up)
4. Ethan T. and Dave J. (Database -> Backend)
5. Questions

## Agile Sprint Review Meeting Notes

### Displays of the Entry page of the Bullet Journal once the user has been signed in
- Main part of bullet journal displayed is done
- The site shows all of the user's bullet journals and displays a plus button to add a new journal and a search bar to search for a particular journal
- We can see a brief amount of information from each bullet journals such as its name, and certain tags

###### TO DO
- Still need to connect the database.
- Connecting User authentication from sign up and sign in to the database to then be used for this page
- Create a sidebar with the following capabilities
  - Create a Logout tab 
  - go back to journals tab
- Add more CSS to the file to enhance the site's style
- Entries sorts by week and by day if necessary and if time

### Displays of individual Bullet Journal with TODOs once user has clicked on it
- The site is still being developed but an image was shared that has the planned site implementation
- Includes a sidebar with logout, go back to journals tab, and entries tab
- Each day on the todo has tags and clicking on the day/tags creates a popup with more text and descriptions that users have entered
  - Text can be added on this pop up
  - 
###### TO DO
- Need to start implementing this now that the design is complete and everyone signed off on it
- Still need to connect the database of users.
- Create a sidebar with the following capabilities
  - Create a Logout tab 
  - go back to journals tab
- Create a weekly and daily todo

### Sign Up and Sign In page
- The Landing page right now is the sign in page.
- Either the user inputs email and password to sign in if an account exists
- Or, the user clicks sign up and inputs necessary information to register the account into the database. 
- Next, the user presses go back and then inputs the info into the login and then logs in.
- At this point, the group still has not completed the user authentication with google firebase

###### TO DO:
- Use Google firebase to authenticate users
- Connecting User authentication from sign up and sign in to the database to then be used for this page
- If time, create a landing page
- More immediately, once user is authenticated, then team members will assist with using that information and connect with the database

### Backend Database
- Backend of the entire thing has been configured using google firebase
- Use the database to populate information for each user
- showed an example journal and how to use the functions
- call on these functions to get what is necessary
  - List of functions currently implemented: get todos, edit todo, create New Journal, delete Journal, edit Journal, createNewTodo, deleteTodo 

###### TO DO:
- Get Journals of the user needs to be done
- use what is created from this to find the user's journals and connect all of this data between each page of the site (group effort).

### Question and Answer
Question:
What is the difference between Entries and Journals?      
Answer: Journal is a container for the entries.      
Question: How will users add and delete todos?     
Answer: Add and delete todos from the journal via the database.     
Question What do teams do if they are done early?
Answer: Lots of database work needs to be done so a team can join forces with another team or get started on connecting user's information together using database.  

Finish Time: 6:30 PM.   
Take short break, then continue with the retrospective meeting.     



