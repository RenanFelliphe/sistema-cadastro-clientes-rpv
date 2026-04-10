interface IEndereco {
    rua: string,
    numero: string,
    complemento: string
    bairro: string,
    cidade: string,
    estado: string,
}

export function formataEnredeco({rua, numero, bairro, cidade, estado, complemento,}: IEndereco): string{
    return `${rua}, ${numero} - ${complemento}, ${bairro}, - ${cidade}/${estado}`
}