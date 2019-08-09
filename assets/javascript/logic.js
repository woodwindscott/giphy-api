$(document).ready(function(){

    // Initial array of topics
    var topics = ["cat", "dog", "kangaroo", "rabbit", "frog", "lion", "tiger", "pig", "skunk", "bird", "alligator"];

    // API KEY for Giphy
    var apiKey = "B8IYtSy43RbJ9nvJ6QQjHVs49mVbQ5y0";

    // Function for displaying topic buttons
    function renderButtons() {

        // Deleting the topic buttons prior to adding new topic buttons
        $("#buttons-view").empty();

        // Looping through the array of topics
        for (var i = 0; i < topics.length; i++) {

            // Then dynamicaly generating buttons for each topic in the array.
            var a = $("<button>");
            // Adding a class
            a.addClass("topic-button");
            // Adding a data-attribute with a value of the topic at index i
            a.attr("data-name", topics[i]);
            // Providing the button's text with a value of the topic at index i
            a.text(topics[i]);
            // Adding the button to the HTML
            $("#buttons-view").append(a);
        }
    // End of renderButtons function    
    }

    // Function for displaying gifs retrieved from Giphy by clicking the appropriate topic button
    function displayGiphy() {

        // Clears display field
        $("#topics-view").empty();

        var topicChoice = $(this).attr("data-name");
        // populates the URL to query giphy.com
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=" + topicChoice + "&limit=10";

        // AJAX call to get information from giphy
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {

            var results = response.data;

            for (var i = 0; i < results.length; i++) {

                // creating a div wrapper to contain rating text and gif
                var resultDiv = $("<div>");
                resultDiv.addClass("final-gif");

                // generating an new variable to hold the URL to the image
                var imageUrl = results[i].images.fixed_height_still.url;

                // creates the rating display
                var ratingP = $("<p>");
                ratingP.addClass("rating-text");
                ratingP.text("Rating: " + results[i].rating);

                // creates an image tag
                var myImage = $("<img>");

                myImage.addClass("my-gif");

                // fills in the rest of the code to properly source the url of the gif
                myImage.attr("data-still", results[i].images.fixed_height_still.url);
                myImage.attr("data-animate", results[i].images.fixed_height.url);
                myImage.attr("data-state", "still");
                myImage.attr("src", imageUrl);
                myImage.attr("alt", "my image");

                resultDiv.append(myImage, ratingP);
                // Adds new images to the top left of the screen
                $("#topics-view").append(resultDiv);
            }

            $(".my-gif").on("click", function() {
                // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
                var state = $(this).attr("data-state");
                console.log(this);
                // If the clicked image's state is still, update its src attribute to what its data-animate value is.
                // Then, set the image's data-state to animate
                // Else set src to the data-still value
                if (state === "still") {
                $(this).attr("src", $(this).attr("data-animate"));
                $(this).attr("data-state", "animate");
                } else {
                $(this).attr("src", $(this).attr("data-still"));
                $(this).attr("data-state", "still");
                }
            });
        });
    }

    // This function handles events where the "add an animal" button is clicked
    $("#add-topic").on("click", function(event) {
        // event.preventDefault() prevents the form from trying to submit itself.
        event.preventDefault();

        // This line will grab the text from the input box
        var topic = $("#topic-input").val().trim();
        // The new topic from the textbox is then added to our array
        topics.push(topic);

        // Clears the value of the input box
        $("#topic-input").val("");

        // calling renderButtons which handles the processing of our topic array
        renderButtons();
    });

    // Calling the renderButtons function at least once to display the initial list of topics
    renderButtons();

    // Adding a click event listener to all buttons with a class of "topic-button"
    // Then runs displayGiphy function
    $(document).on("click", ".topic-button", displayGiphy);

});