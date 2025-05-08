export const convertTimeString = (text) => {
    return new Date(text).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "America/Sao_Paulo"
    })
}