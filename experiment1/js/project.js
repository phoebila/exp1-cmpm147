// project.js - purpose and description here
// Author: Phoebe Royer
// Date: 4/5/24

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
main()
function main() {
  const fillers = {
    opener: ["dude", "bro", "bitches", "beautiful lady", "goth mommies", "e-girls", "ladies", "queens", "soul-tie", "fellow life explorer", "future dog mom"],
    basic_name: ["Chad", "Jake", "John", "Graham", "Jacob", "Lucas"],
    looking_for: ["go bouldering with", "explore the city with me", "hookup with","go to church with", "get married to me", "have a good time with", "raise my dog with me"],
    bio_no: ["pronouns", "cats", "vaping", "star signs", "kids", "no car", "baby daddies", "feminism", "liberalism", "blue hair"],
    turn_ons: ["tattoos", "dogs", "guns", "republicanisms", "blonde hair", "daddy issues", "a septum piercing", "white people dreads", "bar pics"]
    
  };
  
  const template = `What's up my $opener,
  My name is $basic_name, and I'm looking for someone to $looking_for, if that isn't you swipe left!
  If you have $bio_no in your bio, definitely swipe left!!!
  Ladies who have $turn_ons in their photos hit me up ;)
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    // box.innerText = story;
    $("#box").text(story);
  }
  
  /* global clicker */
  // clicker.onclick = generate;
  $("#clicker").click(generate);

  
  generate();
  
}

// let's get this party started - uncomment me
//main();