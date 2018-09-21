$(document).ready(function () {

    $(".commentbtn").on("click", function () {
        var thisId = $(this).attr("data-id");
        
        var $titleDiv = $("#"+thisId+"title");
        var $bodyDiv = $("#"+thisId+"body");

        console.log(thisId)

        // Now make an ajax call for the Article
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
            // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);  

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $titleDiv.val(data.note.title);
                // Place the body of the note in the body textarea
                $bodyDiv.val(data.note.body);
            }
        });
    });

    $(".save").on("click", function (event) {
        event.preventDefault();
        //variables for for the data-id        
        var thisId = $(this).attr("data-id");
        console.log(thisId)

        var $titleDiv = $("#"+thisId+"title");
        var $bodyDiv = $("#"+thisId+"body");

        console.log($titleDiv.val());
        console.log($bodyDiv.val());

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $titleDiv.val(),
                // Value taken from note textarea
                body: $bodyDiv.val()
            }
      
        })
            // With that done
            .then(function (data) {
                
                // Log the response
                console.log(data);
                console.log(data.note.title);
                console.log(data.note.body);
                // Empty the notes section
                $(".notes").empty();
                
                // location.reload();
            

            });

        // Also, remove the values entered in the input and textarea for note entry
        $(".titleinput").val("");
        $(".bodyinput").val("");

    });
    //this delete click does not erase from the database, all notes are stored regardless. the user sees them as empty and can input a new note
    $(".delete").on("click", function() {
        event.preventDefault();
        //variables for for the data-id        
        var thisId = $(this).attr("data-id");
        console.log(thisId)
        $(".titleinput").val("");
        $(".bodyinput").val("");
        $(".hide").hide();

    });

    $(".scraper").on("click", function(){
        $.get("/api/fetch").then(function(data){
            initPage();
        })
    })

});
