## Why we use callbacks all the time? 

Because each mongoose/express method takes some time,
and we want to make sure some functions run afeter 
the function before is finished!

Example - seedDB:

If we create new object after remove method and not in the callback,
the removing will be finished after we add our new object into db.
And it will aslo remove this newly added object, what we don't want.

Therefore we always stick it into the callback!!!

## Error driven development
- we write some code we want to work
- we get an error
- we progress by fixing errors one by one until the code works

# Plan:
Sun: Comments, Seeding, Authentication
Mon: Pondbook Authentication, Update + Destroy
Tue: UI imporvements, Deploying
Wed: JS tricky stuff, ECMAScript 6
Thu: Final touch Pondbook, course
Fri: LinkedIn
Sat: Prepare Dominik's portfolio
Sun: -
Mon: Call Dominik
First  week: Portfolio
Second week: Mavi
Third  week: Mendix

# Why to learn web?

- possibly my work
- neccessary to know for CS
- easier in the second semester next year
- GET AN INTERNSHIP/JOB
- gain more understanding of CS
- FUN
- imporve ability to learn languages, technologies
- improve english, typing, googling
- skills themselves

## Require modules

- when we import installed node_modules, we don't need to care about the path, we just import useing the name of the package

- however, when requiring or own modules, we need to specify the path
    * absolute path (/)
    EX: 
    const Pond = require("/home/bublinec/Programming/Web/Pondbook/modules/pond");

    We can use following to get the current dir (where the app.js is):
    // var path = require('path');
    // console.log(path.resolve( __dirname));

    * relative path (./ - current dir (where the app.js is) or ../ - one dir up in the tree)

WE OBVIOUSLY CAN'T START WITHOUT /
