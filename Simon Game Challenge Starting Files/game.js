var buttonColours = ["red","blue","green","yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level  = 0;
var started = false;




$(document).keypress(function () {
    if(started === false) {
        $("#level-title").text("Level "+level);
        nextSequence();
        started = true;
    }

});

$(".btn").on("click",function(event) {
    var userChosenColour  = event.target.id;
    //var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    console.log(userClickedPattern);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
});

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;

}

function nextSequence() {
    userClickedPattern = [];
    
    level++;
    $("#level-title").text("Level "+level);
    var randomNumber = Math.floor(Math.random() * 4);
    console.log("Random number generated is "+randomNumber);
    
    var randomChosenColor = buttonColours[randomNumber];
    console.log("Random color chosen is "+randomChosenColor);

    gamePattern.push(randomChosenColor);

    $("#"+randomChosenColor).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
    
    
}
function playSound(name) {
    var audio = new Audio("sounds/"+name+".mp3");
    audio.play();
}
function animatePress(currentColour) {
    $("#"+currentColour).addClass( "pressed");
    setTimeout(function() {
        $("#"+currentColour).removeClass('pressed');
    }, 100);
}

function checkAnswer(currentLevel) {
    if(userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
      console.log("success");
      console.log("user clicked pattern length : " + userClickedPattern.length + "and game pattern length : " + gamePattern.length);
      if (userClickedPattern.length === gamePattern.length) {
          setTimeout(nextSequence(),2000);
      }
    }
    else {
      console.log("wrong");
      playSound("wrong");
      $("body").addClass( "game-over");
      setTimeout(function() {
        $("body").removeClass('game-over');
      }, 200);
      $("#level-title").text("Game Over, Press Any Key to Restart");
      startOver();
    }
  }