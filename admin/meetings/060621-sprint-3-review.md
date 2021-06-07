# Notes from the Third Sprint Review Meeting
Date: Sunday, June 6th, 2021.      
Members Present: Everyone except Dave (Edward joined late because of CSE 101 Final)     
Time Started: 6 PM.   

## Agenda and Order of Presentations
1. Allen, Edward, Frank, and Abhishek (Daily and Weekly Todo and All Entries Page)
2. Ethan W. (Converting to SPA and also creating entries for each journal)
3. Jacob and Dave (journals page landing page)
4. Ethan T. (Database -> Backend)
5. Questions

## Agile Sprint Review 3 Meeting Notes

### Displays of all entries page with TODOs once user has clicked on it
- This portion is completely done and has been connected with the database
- All tags show up and a user can select tags appropriately
- Edit task is completed as well and the results of those changes are shown in the database
- The style looks great and it is done


###### TO DO
- Connect with journal's team
- In addition, we need to maybe think about adjusting the database (just a simple addition to the entries json files) so that we get the journal for each entry in the case that the same entry exist between two different journals

### Converting to SPA
- This is taking some time because of the sign in and sign out features but right now, we are focusing more on the journal's component.

### Displays of the Journal page of the Bullet Journal once the user has been signed in
- Main part of bullet journal displayed is done
- The site shows all of the user's bullet journals and displays a plus button to add a new journal and a search bar to search for a particular journal
- The team has created a way for the user to input bullet points, ordered lists, and links into entries/journals. 
- The database has been incorporated for everyting except the create new entries part

###### TODOS:
- We created an ADR on this because we realized that there is not much difference between the journal's team and the entries team because a user can actually edit tasks within the journals page as well
- Therefore, we decided to scrap mots of our journal's page and instead, use the existing Journal's showing page and when a user clicks on one of the journals, it should take them to an entries page that looks the same as the all entries page except it only shows the tasks for that specific journal.
  - In this individual journal page, we can edit and add tasks as well as mark them as done.
- All the work that this requires is using the same code from the all entries page but make the entries specific to one journal. In addition, we would need to implement funcitonality to add a task which we can take from the journal's team (The CSS is basically the same as the all entries page except with the addition of another CSS element)

### Database
- Backend of the entire thing has been configured using google firebase
- All methods created and this portion is done
- All that was changed from before was that some functions were changed to async so that onload of a window, the changes get adjusted immediately instead of synchronously.


### Question and Answer
- What is our plan for the sign in and signout functionality? Right now ,we havent connected it with anything and we need to get the username that the user enters
    - Ans: If we have time, we will implement this but it would require time (functionailty to connect to the backend already exists but it would require getting the username within every single file).

##Plans for this week
 - Hopefully finish all the project by Tuesday and being making our videos on Tuesday and Wednesday.     
Finish Time: 7 PM.   
