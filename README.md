# CSE 110 Project - Bullet Journal - Team 28

# Onboarding Documentation

## Introduction

A bullet journal is a tool for individuals to use to organize their tasks in an easily accessible manner. Some important features of a bullet journal are: 
  1. Sections to log daily to-dos
  2. Ability to record long term and short term goals 
  3. Ability to sort tasks by subject into small collections

You can access our bullet journal webapp [here](https://bullet-journal-110.web.app/) 

[Final Team Video (Public Version)](https://youtu.be/oQ4GkGzSK6g)
[Final Team Video (Private Version)](https://youtu.be/JnpN0d97ohY)

Journal's Page
![Alt text](/public/images/JournalPage.png "Journal's Page")


All Entries Page
![Alt text](/public/images/AllEntriesPage.png "All Entries Page")

## Introduction to our team
[Team Page](/admin/team.md)

## Agile Sprint Notes
  1. [Sprint 1](/admin/meetings/Agile/FirstSprintAndRetrospectiveNotes/051621-sprint-1-review.md)
  2. [Sprint 2](/admin/meetings/Agile/SecondSprintAndRetrospectiveNotes/053021-sprint-2-review.md)
  3. [Sprint 3](/admin/meetings/Agile/ThirdSprintMeeting/060621-sprint-3-review.md)

## Agile Retrospective
  1. [Retrospective 1](/admin/meetings/Agile/FirstSprintAndRetrospectiveNotes/051621-sprint-1-retrospective.md)
  2. [Retrospective 2](/admin/meetings/Agile/SecondSprintAndRetrospectiveNotes/053021-sprint-2-retrospective.md)

## Team meeting Notes
  1. [Meeting 1](/admin/meetings/041221-kickoff.md)
  2. [Meeting 2](/admin/meetings/041821-brainstorm.md)
  3. [Meeting 3](/admin/meetings/042521-pitchAndBrainstorm.md)
  4. [Meeting 4](/admin/meetings/042621-PitchMeeting.md)
  5. [Meeting 5](/admin/meetings/050221-SecondPitchMeeting.md)
  6. [Meeting 6](/admin/meetings/050321-ProjectPitchandAssignmentDiscussion.md)
  7. [Meeting 7](/admin/meetings/050621-AssigningTasks.md)
  8. [Meeting 8](/admin/meetings/050921-CatchUpMeetingAndUpdate.md)
  9. [Meeting 9](/admin/meetings/052321-UpdateOnTasks.md)

## Steps to emulate this project on your local:
  1. Git clone the entire repo into your local computer
  2. Install Node.js on your local computer via this [link](https://nodejs.org/en/)
  3. Run `npm install` from the command line in your IDE with your copy of the project open. This will download and install all the necessary node modules to your copy.
  4. Install Firrebase CI if on windows or run `npm install firebase` if on Mac/Linux
  5. Create a Firebase account, enable Firebase database and auth, and reconfigure anywhere in our JavaScript files with `firebase config` variables setup at the top with your own personal firebase config information. 
  6. Run `firebase init hosting` in the Firebase CLI if on windows, or `firebase emulators:start` in terminal if on Mac/Linux to start up a Firebase local host working website of the project 
  7. Create a login account on the Firebase website console in the Auth section from which you can login into the website and start using its bullet journal functionalities. 


## CI/CD Pipeline Information and Documentation

You can find all docs related to the CI/CD pipeline under /admin/cipipeline, including process diagrams, videos, and overviews of the process, or click [here](/admin/cipipeline)

For the video on how the CI/CD pipeline workflow works as well as an example of it in action, follow the link [here](/admin/cipipeline/phase1-update.mp4)

## Source Code
[/public](/public) contains all of our source code for the bullet journal project. We have separated the code into a /backend folder, /css folder, /js folder, and the index.html is in the root of /public. 

For documentation, refer to the jsDocs generated in /out or click the link [here](/out)

## Testing

Because the application depends on the functionality of the backend, unit tests were created to exclusively test the backend. All tests can be found in [/__tests__](/__tests__).

