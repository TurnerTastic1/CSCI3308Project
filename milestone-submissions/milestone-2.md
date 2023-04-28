# Milestone 2
The second milestone period saw primary work on the front-end, including the routes page, static profile view, and a home page.

However, on the back end, we found a significant roadblock in the prior-set plan to base our application off of data garnered from transit and ride-hailing APIs. Particularly, the Uber Riders API's token system migrated from a hybrid server key and user authentication plan to full-access restriction, where information could only be requested under association with an OAuth rider. The legal infrastructure required in order to access this user-authenticated format is beyond the capabilities of our timeline.

## Pivoting
Consequentially, the app concept demanded a pivot. We began to reframe our product to a then-icebox detail of the app: social ride planning.

Now, users can register and plan trips for the future, or browse other users' similar trips and join in!

Thanks to the work already implemented, the pivot demands no structural front-end changes, although back-end work was scrapped for redesign.

While the front-end team continued in the new direction, the back-end team developed a new schema and use case diagram to guide development.

<p align="middle">
  <img src="https://github.com/TurnerTastic1/TurboTransit/blob/4a0b7e5728aa1bfb2f703344b4945d9e0844302f/milestone-submissions/TurboTransit2-Schema%20ERD.png" alt="Pivot schema" height="300">
  <img src="https://github.com/TurnerTastic1/TurboTransit/blob/4a0b7e5728aa1bfb2f703344b4945d9e0844302f/milestone-submissions/TurboTransit2-Use%20Case%20Diagram.png" alt="Pivot UCD" height="300">
</p>
