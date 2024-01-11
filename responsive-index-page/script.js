function dropDownMenu() {
    let navDropDown = document.getElementById("dropdownclick");
    if (navDropDown.className === "topnav") {
        navDropDown.className += " responsive";
    } else {
        navDropDown.className = "topnav";
    }
}