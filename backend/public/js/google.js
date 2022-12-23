function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    alert(profile.getName())
    $("#name").text(profile.getName())
    $("#email").text(profile.getEmail())
}