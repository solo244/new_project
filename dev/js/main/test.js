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
      console.log("Loaded another file ;)");
    }

    /*
     * Let's get ready to rumble
     */
    $(document).ready(function(){
      // instantiate
      $body.on("click", started);
    });

})(jQuery);
