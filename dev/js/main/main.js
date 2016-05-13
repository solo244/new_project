(function ($) {

    /*
     * Vars
     */
    var $body = $("html, body");

    /*
     * OMG, it's a function
     */
    function started(e){
      var $this = $(this);
      console.log("We've got lift off!");
    }

    /*
     * Let's get ready to rumble
     */
    $(document).ready(function(){
      // instantiate
      $body.on("click", started);
    });

})(jQuery);
