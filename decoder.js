function submitDecode() {
    let decodeInput = document.getElementById("input").value;
    let jsonStringDecoded = decodeURIComponent(escape(atob(decodeInput)));
    let decodedArray = JSON.parse(jsonStringDecoded);
    console.log("DECODED ARRAY")
    console.log(decodedArray);
}