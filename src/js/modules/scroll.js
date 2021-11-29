export default $(function() {
    $("a[href^='#']").click(function(event) {
        event.preventDefault();
        const target = $(this).attr("href");
        $("html, body").stop().animate({
            scrollTop: $(target).offset().top
        }, 600);
    });
})