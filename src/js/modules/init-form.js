import Validator from "./validator";
import select from "./country_select";

$(function() {
    new Validator("#form").init();
    select(".js-select");

    $(".input__field").on("input", (e) => {
        const input = $(e.target);
        const placeholder = input.closest(".input").find(".input__placeholder");

        if (input.val() === "") {
            placeholder.removeClass("typed");
        } else {
            placeholder.addClass("typed");
        }
    })
})