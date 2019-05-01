# Dexter
A tool designed to help trainers know type matchups between their 
Pok&eacute;mon and their opponent's so they may use them to their advantage during
battles.

# Motivation
How many times have you been in a Pok&eacute;mon battle and asked yourself, "What 
type are they again?" or "What type are they weak against?" If you're like me, 
a lot. This tool was created for this reason. It's something you can use to quickly 
lookup your (or your opponent's) Pok&eacute;mon and get valuable information
on what type they are, and what types they take the most damage from.

# Screenshots
![Pok&eacute;mon Info](./images/pokemon-example.PNG)

![Team Evaluator](./images/team-example.PNG)

# Features
- Pok&eacute;mon Info: pok&eacute;dex number, name, images, type[s], height, weight, and damage multipliers for received attacks.
- Team Evaluator: Takes up to six Pok&eacute;mon and forms an evaluation of the team for each attack type based on how effective attacks of that type are against each of your team members.

# Tech Used
- HTML5
- CSS3
- JavaScript (ES7)
- [Bootstrap 4](https://getbootstrap.com/)
  
# Other Resources Used
- [Pok&eacute;API](https://pokeapi.co/)
- [Font Awesome](https://fontawesome.com/)
- [Google Fonts](https://fonts.google.com/)

# Compatability
Due to the use of some ES7 functionality, (specifically the fetch API and `async/await`) this application doesn't work in Internet Explorer. Additionally, the suggestions that appear below input fields won't work on Android WebView due to the use of the `<datalist>` HTML5 element. I apologize for any inconveniences here.

# Credits
Thanks to [Pok&eacute;API](https://pokeapi.co/) for providing such a great resource with tons of data to use.

# Deployment
[DexterV2](https://morrisbc.github.io/dexter/)
