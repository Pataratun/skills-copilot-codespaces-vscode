function skillsMember() {
    var skills = document.getElementById("skills").value;
    var skillsError = document.getElementById("skillsError");
    var skillsRegex = /^[a-zA-Z0-9 ]{2,}$/;
    if (skillsRegex.test(skills) == true) {
        skillsError.innerHTML = "";
        return true;
    } else {
        skillsError.innerHTML = "Skills must be at least 2 characters";
        return false;
    }
}