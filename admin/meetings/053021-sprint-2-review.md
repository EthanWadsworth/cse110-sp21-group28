# Notes from the Second Sprint Review Meeting
Date: Sunday, May 30th, 2021.      
Members Present: Everyone except Dave      
Time Started: 6 PM.   

## Agenda and Order of Presentations
1. Frank, Jacob, and Abhishek (Sign In and Sign Up)
2. Ethan W. and Dave J. (Entry page of the Bullet Journal after sign in)
3. Allen and Edward and Abhishek (Daily and Weekly Todo and individual bullet journal)
4. Ethan T. and Dave J. (Database -> Backend)
5. Questions

## Agile Sprint Review 2 Meeting Notes

### Sign Up and Sign In page
- The Landing page right now is the sign in page.
- From the last sprint meeting, the group has successfully incorporated the database into the authentication of username and password
- In addition, if email is wrong/is not a valid email, outputs an alert. 
- Similarly, if a password is not valid or if the account doesnt exist, outputs an alert


###### TO DO:
- For the purposes of this assignment, this group's work is done except to connect the sign-in, sign-up, log-out features to various pages.

### Displays of the Entry page of the Bullet Journal once the user has been signed in
- Main part of bullet journal displayed is done
- The site shows all of the user's bullet journals and displays a plus button to add a new journal and a search bar to search for a particular journal
- The team has created a way for the user to input bullet points, ordered lists, and links into entries/journals. 

###### TO DO
- Still need to finish connecting to the database.
- Connecting User authentication from sign up and sign in to the database to then be used for this page

### Displays of individual Bullet Journal with TODOs once user has clicked on it
- The html portion is done and basic functionality is complete
- Basically, when you load the page, the window updates to the current day. 
- The week range updates accordingly and the date next to sunday, monday, tuesday, etc, is also updated accordingly.
- When you double click on one of the tasks, an edit screen shows up and the data that was previously inputted will be shown.
- Clicking on a button to go to the next week range basically updates the dates on the weekly dates side but keep the daily todo side unaffected unless the user clicks on
one of the days of the week


###### TO DO
- Finish implementing sidebar (specifically log out)
- Still need to connect the database of users.
- Attach tags to each date properly and update when changing week ranges.
- When double clicking on a task, that should open up an editing page (although it does this, the current container should change and not open up a new editing page)
- When user edits a task, implement submit/cancel buttons and also revert back to updated task
- Only one editing page at a time


### Database
- Backend of the entire thing has been configured using google firebase
- All methods created and this portion is done

###### TO DO:
- use what is created from this to find the user's journals and connect all of this data between each page of the site (group effort).
- Each team member needs to help each of the remaining tasks and aid with connecting with the database or with finishing up tasks from other groups.

### Question and Answer
- No Questions

Finish Time: 6:30 PM.   
