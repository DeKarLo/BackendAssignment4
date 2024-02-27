function changeLanguage(language) {
    fetch("/change-language", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ language: language }),
    })
        .then((response) => {
            if (response.ok) {
                console.log(language + " language selected");
                window.location.reload();
            } else {
                console.error("Failed to change language");
            }
        })
        .catch((error) => console.error("Error:", error));
}
