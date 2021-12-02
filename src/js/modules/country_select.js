import countryCodes from "country-codes-list";
import Inputmask from "inputmask";

const select = (selector) => {
    const myCountryCodesObject = countryCodes.customList('countryCode', '+{countryCallingCode}');
    const btn = $(selector);
    const phone = document.getElementById("phone");
    let selected = false;

    btn.on("click", (e) => {
        const wrap = $(e.target);
        const parent = wrap.closest(".input")
        const placeholder = parent.find(".input__placeholder");
        const list = parent.find(".select__list");

        wrap.toggleClass("active");
        if (!selected) {
            placeholder.toggleClass("typed");
        }

        if (wrap.hasClass("active")) {
            list.slideDown(300);
        } else {
            list.slideUp(300);
        }
    });

    $(".select__list span").on("click", (e) => {
        const option = $(e.target);
        let selectedCountryCode = option.attr("data-value");

        btn.text(option.text());
        btn.addClass("selected");
        $(".select-placeholder").addClass("typed");
        $(".select__list span.selected").removeClass("selected");
        option.addClass("selected");
        btn.removeClass("active");
        $(".select__list").slideUp(300);

        let countryCodeNumber = myCountryCodesObject[selectedCountryCode].replaceAll("9", "\\9\\");
        Inputmask({ "mask": countryCodeNumber + "99999999999999", "placeholder": "", showMaskOnHover: false }).mask(phone);
        selected = true;
    });
};

export default select;