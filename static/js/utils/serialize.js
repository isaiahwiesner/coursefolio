const serialize = (string) => {
    return string.replaceAll("&#39;", '"')
        .replaceAll("&#34;", '"')
        .replaceAll("None", 'null')
        .replaceAll("False", 'false')
        .replaceAll("True", 'true')
}