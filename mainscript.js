function loadConfig() {
    const params = new URLSearchParams(window.location.search);
    const names = params.get('names');
    const colors = params.get('colors');
    console.log(names);
    console.log(colors);
}