# Project 1

Shaq's Free Throw Nightmare is meant to be a version of space invaders. This was a grid based game made primarily as an introduction to **Javascript**, and is my first project on the General Assembly Software Engineering Immersive course.

**Duration** 7 days.

**Technologies Used** HTML, CSS, Javascript.

**LINK**

https://jdeering94.github.io/Shaq-s-Free-Throw-Nightmare/

# Site Overview

<p>
<img src="./assets/shaq-startscreen.png" />
<img src="./assets/shaq-gameplay.gif" />
</p>

# The Brief

Using HTML, CSS, and Javascript, recreate an old grid-based arcade game.

For Space Invaders, the minimum requirement was for that:
The player should be able to clear at least one wave of aliens.
The player's score should be displayed at the end of the game.

# Preliminary work

I wrote down my minimum requirements for the passable game, as well as the starting points for how I thought I would do each function. I also established a wishlist of features I would implement if I had time.

# Day 1

With my set of requirements, I started by creating the game grid and adding a spaceship class that could move. To create the grid, I used javascript, creating a for loop that created a number of cells based on the width of the grid that I wanted. To add the spaceship, I created my two functions that I would need for movement, addSpaceship and removeSpaceship, and ran the addSpaceship at the beginning of the code. These functions added or removed the class spaceship from cells in my grid. I then needed to write a function that used them in order to simulate movement. I decided to use a switch statement that would incorporate multiple types of keyinputs, as I would need it later in order to make my laser fire. I set two cases for the left and right arrow keys and added my movement functions to them, adding in if statements so that the function wouldn't fire if the spaceship was at either edge of the grid. I then added a laser fire option to that same handlekey event and startted to make my laser function. My approach was to write a function that establishes the source of the laser, and then using setinterval, would increment its position until it hit the top of the grid.

# Day 2

The goal this day was to create my alien swarm, get them able to be hit by the laser, and get it moving. My swarm was created by added an array where I would want them to be placed, and passing that array into the createGrid function, so that if any cells matched, they would be given the class 'alien'. I then altered my laser function, adding an if statement for the case of the cell containing both laser and alien, which allowed for the impression of the alien being destroyed. I then thought the best was to go about getting the alien swarm moving was to figure out the logic for one, and then refactor the logic to account for multiple aliens. My initial idea was to use arrays and forEach for the multiple case, which proved to be a mistake. Once I got the logic to move one alien, I spent time trying to expand it for multiple cases but couldn't figure out how to.

# Day 3

The goal was to fix the swarm movement issue. The main issue being that if one alien hit the boundary, that one would move as it should but the rest of them wouldn't match the movement. I realized that if I used for loops instead, I could get the swarm to move all together and that it would all change even if only one alien had hit the boundary. This allowed for the swarm movement to be dynamically adjuested as they were destroyed. I also realised that my laser logic was flawed, and that it not only had to remove the class of the alien, but also to splice that element from the alienArray, otherwise it would reappear after being hit once the swarm moved. I also added a score that would increment with each alien hit. I then used the same logic for the laser firing to make a function to drop bombs, the function being triggered randomly each time the swarm moved.

# Day 4

I used this day to add win/loss conditions based on the alienArray length, or the spaceship being hit by a bomb, or the aliens reaching the bottom row. I also styled it somewhat, after I decided to go with the theme of Shaq's Free Throw Nightmare as a concept. The bombs weren't quite behaving as I was hoping they would, but I didn't know what the exact issue was or how to fix it. My progress was also severly hampered by an issue where once I started the game with a button click, when I used the spacebar to fire a laser, it would start the game again, adding another setInterval of alien movement and thus speeding the game up rapidly. I thought it was an issue with nesting functions, but I found out through testing that it was the spacebar that was causing the issue, so I changed the input to the 'z' key. This was finally my MVP.

# Day 5

With my MVP, I wanted to add more styling to it, and also to add some stretch goals, like a mothership and interaction between bombs and the laser, as well as adding barriers to hide behind. I was able to add the mothership and barriers fine, the barriers the same way I created my alien swarm and the mothership following similar logic to the bombs as it would appear on a random chance and end at a set point. It was here I found out my bomb function was badly coded, as when there were multiple bombs onscreen, the interactions with collisions didn't work anymore. My solution was to limit the function to running once, so that there was only one bomb onscreen at a time.

# Day 6

Spent most of the day adding sound effects that would trigger on certain functions firing, mainly collisions, and alos a soundtrack that plays when the game is running. I also added a life counter to the game, a simple array, and also a function that refreshes the alien swarm for a set number of waves, with each eave increasing in speed. I was able to get this working by making the interval speed a variable that I would access everytime the swarm resets, for a total of two resets or three waves. I also reworked my bomb function, making use of a bombArray so that there could be multiple on screen. It was a mistake to reuse the laser logic, and in retrospect I should have based it off of the function to move the swarm. Since the logic was there, it was a fairly straghtforward process to change the function to run off of for loops operating on the bombArray, so that the position of each bomb is always known. This approach also fixed all the collision issues I was having and finally I was able to have multiple bombs dropping onscreen and interacting with the different elements of laser, barrier, and spaceship.

### Wireframes:

## Major Hurdles
